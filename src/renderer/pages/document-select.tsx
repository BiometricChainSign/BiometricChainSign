import { useState } from 'react'
import { Group, Stack, Text, Title, rem, useMantineTheme } from '@mantine/core'
import { Dropzone, PDF_MIME_TYPE, FileWithPath } from '@mantine/dropzone'
import { IconFile, IconUpload, IconX } from '@tabler/icons-react'
import { PDFDocument } from 'pdf-lib'
import { notifications } from '@mantine/notifications'
import { useNavigate } from 'react-router-dom'
import { useAccount } from 'wagmi'

import { read } from '../wagmi-hooks'
import { getFileHash } from '../helpers'

export default function DocumentSelectPage() {
  const theme = useMantineTheme()
  const navigate = useNavigate()
  const { address } = useAccount()
  const [loading, setLoading] = useState(false)

  async function onDrop(files: FileWithPath[]) {
    setLoading(true)

    try {
      const file = files[0]!
      const fileBuffer = await file.arrayBuffer()

      // if the file is corrupted or encrypted, this will throw an exception
      // firing an error notification
      await PDFDocument.load(fileBuffer, { ignoreEncryption: false })

      const documentHash = await getFileHash(fileBuffer)
      const signatories = await read({ functionName: 'getDocumentSignatories', args: [documentHash] })

      if (!signatories.length) {
        // Document hasn't been signed yet
        navigate('/face-capture', { state: { action: 'sign', data: { pdfFile: file } } })
        return
      }

      // Someone has already signed this document
      navigate('/signatory-addresses', {
        state: {
          data: { documentHash: documentHash, addresses: signatories, userIsSignatory: signatories.includes(address!) },
        },
      })
    } catch (error) {
      console.log(error)

      notifications.show({
        autoClose: 5000,
        title: 'Algo deu errado',
        message: 'Verifique se o arquivo não está corrompido ou criptografado.',
        color: 'red',
        icon: <IconX />,
      })
    }

    setLoading(false)
  }

  return (
    <Stack justify='center' align='center' style={{ flexGrow: 1 }}>
      <Title>Assinar ou verificar documento</Title>

      <Dropzone
        onDrop={onDrop}
        accept={PDF_MIME_TYPE}
        maxFiles={1}
        w='100%'
        maw={700}
        style={{ borderRadius: theme.radius.md }}
        loading={loading}
      >
        <Group position='center' spacing='xl' style={{ minHeight: rem(220), pointerEvents: 'none' }}>
          <Dropzone.Accept>
            <IconUpload
              size='3.2rem'
              stroke={1.5}
              color={theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6]}
            />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IconX size='3.2rem' stroke={1.5} color={theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]} />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <IconFile size='3.2rem' stroke={1.5} />
          </Dropzone.Idle>

          <div>
            <Text size='xl' inline>
              Arraste um documento PDF aqui
            </Text>
            <Text size='sm' color='dimmed' inline mt={7}>
              ou clique para selecionar
            </Text>
          </div>
        </Group>
      </Dropzone>
    </Stack>
  )
}
