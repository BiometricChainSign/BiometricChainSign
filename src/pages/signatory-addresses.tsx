import { Box, Button, CheckIcon, Code, Stack, Text, Title, useMantineTheme } from '@mantine/core'
import { IconCheck, IconFileCheck } from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'

export function SignatoryAddressesPage() {
  const navigate = useNavigate()
  const theme = useMantineTheme()

  return (
    <Stack justify='center' align='center' spacing='xl' style={{ flexGrow: 1 }}>
      <Stack spacing='xs' align='center'>
        <IconFileCheck size={120} color={theme.colors.indigo[4]} />
        <Title>Documento encontrado</Title>
        <Text color='dimmed'>Endereços públicos dos signatários</Text>
      </Stack>

      <Stack spacing='xs'>
        <Code style={{ fontSize: theme.fontSizes.lg }}>0x000000000000000000000000000000</Code>
        <Code style={{ fontSize: theme.fontSizes.lg }}>0x000000000000000000000000000000</Code>
        <Code style={{ fontSize: theme.fontSizes.lg }}>0x000000000000000000000000000000</Code>
      </Stack>

      <Button leftIcon={<IconCheck />} variant='light' onClick={() => navigate('/document-select')}>
        Concluir
      </Button>
    </Stack>
  )
}