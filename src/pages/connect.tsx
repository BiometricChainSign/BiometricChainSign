import { Button, Stack, Title } from '@mantine/core'
import { IconCurrencyEthereum } from '@tabler/icons-react'
import { useWeb3Modal } from '@web3modal/react'

export function ConnectPage() {
  const { open } = useWeb3Modal()

  async function openWeb3Modal() {
    await open()
    console.log('heh')
  }

  return (
    <Stack h='100%' m='auto' justify='center' align='center'>
      <Title>Bem-vindo</Title>

      <Button onClick={openWeb3Modal} leftIcon={<IconCurrencyEthereum stroke='1' />}>
        Conectar carteira
      </Button>
    </Stack>
  )
}
