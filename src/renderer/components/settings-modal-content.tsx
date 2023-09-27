import { useState } from 'react'
import { Button, Stack, TextInput } from '@mantine/core'

const jwtRegex = /^([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_\-\+\/=]*)/gm

type Props = { close: () => void }

function SettingsModalContent({ close }: Props) {
  const [web3StorageToken, setWeb3StorageToken] = useState<string | null>(
    localStorage.getItem('web3StorageToken') || null
  )

  const web3StorageTokenIsValid = web3StorageToken?.match(jwtRegex) || false

  async function save() {
    localStorage.setItem('web3StorageToken', web3StorageToken!)
    await window.electron.setWeb3StorageToken(web3StorageToken!)
    close()
  }

  return (
    <Stack>
      <TextInput
        label='Token Web3Storage'
        description='Use seu token do web3.storage se necessário'
        onChange={e => setWeb3StorageToken(e.currentTarget.value)}
        value={web3StorageToken || ''}
        error={web3StorageToken !== null && !web3StorageTokenIsValid ? 'Token inválido.' : ''}
      />

      <Button onClick={save} disabled={!web3StorageTokenIsValid}>
        Salvar
      </Button>
    </Stack>
  )
}

export default SettingsModalContent
