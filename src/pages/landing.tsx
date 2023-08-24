import { Button, Stack, Title } from '@mantine/core'
import { IconCurrencyEthereum } from '@tabler/icons-react'

export function Landing() {
  return (
    <Stack h='100vh' justify='center' align='center'>
      <Title>Bem-vindo</Title>
      <Button leftIcon={<IconCurrencyEthereum stroke='1' />}>Conectar carteira</Button>
    </Stack>
  )
}
