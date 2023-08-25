import { ActionIcon, Group, Text } from '@mantine/core'
import { IconPower } from '@tabler/icons-react'
import { useAccount, useDisconnect } from 'wagmi'

export function Bar() {
  const { address } = useAccount()
  const { disconnect, isLoading } = useDisconnect()

  if (address)
    return (
      <Group maw={1200} h={60} mx='auto' position='right' spacing={20}>
        <Text size='sm' color='gray.6'>
          {address.slice(0, 6)}...{address.slice(address.length - 4)}
        </Text>

        <ActionIcon onClick={() => disconnect()} loading={isLoading} color='red'>
          <IconPower />
        </ActionIcon>
      </Group>
    )

  return <></>
}
