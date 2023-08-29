import { Group, Text, rem, useMantineTheme } from '@mantine/core'
import {
  Dropzone,
  PDF_MIME_TYPE,
  IMAGE_MIME_TYPE,
  MS_WORD_MIME_TYPE,
  MS_EXCEL_MIME_TYPE,
  MS_POWERPOINT_MIME_TYPE,
  FileWithPath,
} from '@mantine/dropzone'
import { IconFile, IconUpload, IconX } from '@tabler/icons-react'

export function SelectDocument() {
  const theme = useMantineTheme()

  async function onDrop(files: FileWithPath[]) {
    const file = files[0]!

    const hash = await crypto.subtle.digest('SHA-256', await file.arrayBuffer())
    const hashArray = Array.from(new Uint8Array(hash))
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('')

    console.log(hashHex)
  }

  return (
    <Dropzone
      onDrop={onDrop}
      onReject={files => console.log('rejected files', files)}
      accept={[
        ...PDF_MIME_TYPE,
        ...IMAGE_MIME_TYPE,
        ...MS_WORD_MIME_TYPE,
        ...MS_EXCEL_MIME_TYPE,
        ...MS_POWERPOINT_MIME_TYPE,
      ]}
      maxFiles={1}
      w='100%'
      maw={700}
      m='auto'
      style={{ borderRadius: theme.radius.md }}
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
            Arraste um documento aqui
          </Text>
          <Text size='sm' color='dimmed' inline mt={7}>
            ou clique para selecionar
          </Text>
        </div>
      </Group>
    </Dropzone>
  )
}
