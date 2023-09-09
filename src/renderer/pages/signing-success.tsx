import { Button, Stack, Title, useMantineTheme } from '@mantine/core'
import { IconCheck, IconFileCheck } from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'

export function SigningSuccessPage() {
  const navigate = useNavigate()
  const theme = useMantineTheme()

  return (
    <Stack justify='center' align='center' spacing='xl' style={{ flexGrow: 1 }}>
      <Stack spacing='xs' align='center'>
        <IconFileCheck size={120} color={theme.colors.indigo[4]} />
        <Title>Assinatura concluída</Title>
        {/* <Text color='dimmed'></Text> */}
      </Stack>

      <Button leftIcon={<IconCheck />} onClick={() => navigate('/document-select')}>
        Concluir
      </Button>
    </Stack>
  )
}
