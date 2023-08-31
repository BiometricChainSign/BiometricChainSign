import { ActionIcon, AspectRatio, Box, Button, Loader, Stack, Title, useMantineTheme } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconCamera, IconCheck, IconX } from '@tabler/icons-react'
import { useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Webcam from 'react-webcam'

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: 'user',
}

export function FaceCapturePage() {
  const webcamRef = useRef<Webcam>(null)
  const navigate = useNavigate()

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
  }, [])

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot()
    console.log(imageSrc)

    notifications.show({
      title: 'Sucesso',
      message: 'Documento assinado!',
      color: 'teal',
      icon: <IconCheck />,
      autoClose: 10000,
    })

    navigate('/document-select')
  }, [webcamRef])

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
            onClick={capture}
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
