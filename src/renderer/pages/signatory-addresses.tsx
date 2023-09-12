import { Button, Code, Group, Stack, Text, Title, useMantineTheme } from '@mantine/core'
import { IconCheck, IconFaceId, IconFileCheck, IconSignature } from '@tabler/icons-react'
import { useLocation, useNavigate } from 'react-router-dom'

type NavigationState = { data: { documentHash: string; addresses: string[]; userIsSignatory: boolean } }

export default function SignatoryAddressesPage() {
  const navigate = useNavigate()
  const theme = useMantineTheme()
  const location = useLocation()
  const {
    data: { documentHash, addresses, userIsSignatory },
  } = location.state as NavigationState

  return (
    <Stack justify='center' align='center' spacing='xl' style={{ flexGrow: 1 }}>
      <Stack spacing='xs' align='center'>
        <IconFileCheck size={120} color={theme.colors.indigo[4]} />
        <Title>Documento encontrado</Title>
        <Text color='dimmed'>Endereços públicos dos signatários</Text>
      </Stack>

      <Stack spacing='xs'>
        {addresses.map(address => (
          <Code key={address} style={{ fontSize: theme.fontSizes.lg }}>
            {address}
          </Code>
        ))}
      </Stack>

      <Group>
        <Button leftIcon={<IconCheck />} variant='light' onClick={() => navigate('/document-select')}>
          Concluir
        </Button>

        {userIsSignatory && (
          <Button leftIcon={<IconFaceId />} onClick={() => navigate('/face-capture', { state: { action: 'verify' } })}>
            Verificar assinatura
          </Button>
        )}

        {!userIsSignatory && (
          <Button
            leftIcon={<IconSignature />}
            onClick={() =>
              navigate('/face-capture', {
                state: {
                  action: 'sign',
                  data: { signDocumentArgs: [documentHash, documentHash + Math.round(Math.random() * 1000)] },
                },
              })
            }
          >
            Assinar documento
          </Button>
        )}
      </Group>
    </Stack>
  )
}
