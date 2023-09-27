import { ActionIcon, Group, Modal, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconPower, IconSettings } from '@tabler/icons-react'
import { useAccount, useDisconnect } from 'wagmi'

import SettingsModalContent from './settings-modal-content'

export default function Bar() {
  const { address } = useAccount()
  const { disconnect, isLoading } = useDisconnect()
  const [settingsOpened, { open: openSettings, close: closeSettings }] = useDisclosure(false)

  if (address)
    return (
      <>
        <Group maw={1200} w='100%' h={60} mx='auto' position='right' spacing={20}>
          <Text size='sm' color='gray.6'>
            {address.slice(0, 6)}...{address.slice(address.length - 4)}
          </Text>

          <ActionIcon onClick={openSettings}>
            <IconSettings />
          </ActionIcon>

          <ActionIcon onClick={() => disconnect()} loading={isLoading} color='red'>
            <IconPower />
          </ActionIcon>
        </Group>

        <Modal opened={settingsOpened} onClose={closeSettings} title='Configurações' centered>
          <SettingsModalContent close={closeSettings} />
        </Modal>
      </>
    )

  return <></>
}
