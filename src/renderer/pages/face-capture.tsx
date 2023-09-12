import { ActionIcon, AspectRatio, Box, Button, Loader, Stack, Title, useMantineTheme } from '@mantine/core'
import { IconCamera, IconX } from '@tabler/icons-react'
import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Webcam from 'react-webcam'

import { useSignDocument, write } from '../wagmi-hooks'
import { notifications } from '@mantine/notifications'

type NavigationState = { action: 'sign' | 'verify'; data: { signDocumentArgs?: [string, string] } } | undefined

export default function FaceCapturePage() {
  const [loading, setLoading] = useState(false)
  const webcamRef = useRef<Webcam>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const navigationState = location.state as NavigationState

  const { writeAsync: signDocument } = useSignDocument({ args: navigationState?.data.signDocumentArgs })

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
  }, [])

  async function onCapture() {
    setLoading(true)

    try {
      const imageSrc = webcamRef.current?.getScreenshot()
      const { signDocumentArgs } = navigationState?.data || {}

      if (navigationState?.action === 'sign' && signDocumentArgs) {
        try {
          // TODO: temp
          await write({ functionName: 'setSignatoryCid', args: ['0123456789abcdef'] })
        } catch (error) {
          console.log(error)
        }

        await write({ functionName: 'signDocument', args: signDocumentArgs })
        navigate('/signing-success')
      }

      if (navigationState?.action === 'verify') {
        navigate('/verification-success')
      }
    } catch (error) {
      console.log(error)

      notifications.show({
        autoClose: 5000,
        title: 'Algo deu errado',
        message: 'Por favor, tente fazer a captura novamente.',
        color: 'red',
        icon: <IconX />,
      })
    }

    setLoading(false)
  }

  const theme = useMantineTheme()

  return (
    <Stack h='100%' justify='center' align='center' style={{ flexGrow: 1 }}>
      <Title>Captura de face</Title>

      <AspectRatio ratio={1} w='100%' maw={600} mx='auto' bg='gray.2' style={{ borderRadius: theme.radius.md }}>
        <Box>
          <Webcam
            audio={false}
            width='100%'
            height='100%'
            ref={webcamRef}
            screenshotFormat='image/jpeg'
            videoConstraints={{ width: 1000, height: 1000 }}
            style={{ position: 'absolute', borderRadius: theme.radius.md, zIndex: 2 }}
          />

          <Loader m='auto' />

          <ActionIcon
            onClick={onCapture}
            loading={loading}
            size='xl'
            color='indigo'
            variant='filled'
            style={{ position: 'absolute', bottom: 20, margin: '0 auto', zIndex: 2 }}
          >
            <IconCamera />
          </ActionIcon>
        </Box>
      </AspectRatio>

      <Button onClick={() => navigate('/document-select')} leftIcon={<IconX />} variant='light' color='red'>
        Cancelar
      </Button>
    </Stack>
  )
}
