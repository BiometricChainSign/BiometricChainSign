import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ActionIcon, AspectRatio, Box, Button, Loader, Stack, Title, useMantineTheme } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconCamera, IconCheck, IconX } from '@tabler/icons-react'
import Webcam from 'react-webcam'

import { write } from '../wagmi-hooks'

type NavigationState = { action: 'sign' | 'verify'; data: { pdfFile?: File } } | undefined

const showWaitingConfirmationNotification = () =>
  notifications.show({
    id: 'confirmation',
    title: 'Aguardando confirmação',
    message: 'Por favor, confirme a transação em sua carteira.',
    color: 'indigo',
    loading: true,
    withBorder: true,
    autoClose: false,
    withCloseButton: false,
  })

const updateToErrorNotification = () =>
  notifications.update({
    id: 'confirmation',
    title: 'Algo deu errado ao confirmar a transação.',
    message: 'Por favor, tente novamente',
    color: 'red',
    icon: <IconX />,
    withBorder: true,
    autoClose: 3000,
  })

export default function FaceCapturePage() {
  const [loading, setLoading] = useState(false)
  const webcamRef = useRef<Webcam>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const navigationState = location.state as NavigationState

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
  }, [])

  async function onCapture() {
    const imageSrc = webcamRef.current?.getScreenshot()
    const { pdfFile } = navigationState?.data || {}

    if (navigationState?.action === 'sign' && pdfFile) {
      setLoading(true)

      try {
        notifications.show({
          id: 'confirmation',
          title: 'Aguardando confirmação',
          message: 'Por favor, confirme a transação em sua carteira.',
          color: 'indigo',
          loading: true,
          withBorder: true,
          autoClose: false,
          withCloseButton: false,
        })

        // TODO: temp
        await write({ functionName: 'setSignatoryCid', args: ['0123456789abcdef'] })

        notifications.update({
          id: 'confirmation',
          title: 'Sucesso',
          message: 'Transação confirmada!',
          color: 'indigo',
          icon: <IconCheck />,
          loading: true,
          withBorder: true,
          autoClose: 3000,
        })
      } catch (error) {
        updateToErrorNotification()
        console.log(error)
      }

      navigate('/pdf-stamp-add', { state: { data: { pdfFile } } })
    }

    if (navigationState?.action === 'verify') {
      navigate('/verification-success')
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

      <Button
        onClick={() => navigate('/document-select')}
        disabled={loading}
        leftIcon={<IconX />}
        variant='light'
        color='red'
      >
        Cancelar
      </Button>
    </Stack>
  )
}
