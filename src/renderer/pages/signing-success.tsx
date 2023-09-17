import { Button, Group, Stack, Title, useMantineTheme } from '@mantine/core'
import { IconCheck, IconDeviceFloppy, IconFileCheck } from '@tabler/icons-react'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAccount } from 'wagmi'

type NavigationState = { data: { pdfBytes: Uint8Array; pdfName: string } }

export default function SigningSuccessPage() {
  const location = useLocation()
  const navigationState = location.state as NavigationState
  const { pdfBytes, pdfName } = navigationState.data
  const navigate = useNavigate()
  const theme = useMantineTheme()
  const { address } = useAccount()
  const [hasSavedDocument, setHasSavedDocument] = useState(false)

  function saveSignedDocument() {
    const blob = new Blob([pdfBytes], { type: 'application/pdf' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = pdfName.replace('.pdf', '') + ` - ${address!.slice(0, 12)}.pdf`
    link.click()
    setHasSavedDocument(true)
  }

  return (
    <Stack justify='center' align='center' spacing='xl' style={{ flexGrow: 1 }}>
      <Stack spacing='xs' align='center'>
        <IconFileCheck size={120} color={theme.colors.indigo[4]} />
        <Title>Assinatura concluída</Title>
        {/* <Text color='dimmed'></Text> */}
      </Stack>

      <Group spacing='md'>
        <Button leftIcon={<IconDeviceFloppy />} onClick={saveSignedDocument}>
          Salvar documento assinado
        </Button>

        {hasSavedDocument && (
          <Button leftIcon={<IconCheck />} onClick={() => navigate('/document-select')} variant='light'>
            Concluir
          </Button>
        )}
      </Group>
    </Stack>
  )
}
