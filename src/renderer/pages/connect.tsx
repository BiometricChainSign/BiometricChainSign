import { Button, Stack, Title } from '@mantine/core'
import { IconCurrencyEthereum } from '@tabler/icons-react'
import { useWeb3Modal } from '@web3modal/react'

export default function ConnectPage() {
  const { open } = useWeb3Modal()

  return (
    <Stack h='100%' m='auto' justify='center' align='center'>
      <Title>Bem-vindo</Title>

      <Button onClick={open} leftIcon={<IconCurrencyEthereum stroke='1' />}>
        Conectar carteira
      </Button>
    </Stack>
  )
}
