import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ActionIcon, AspectRatio, Box, Button, Loader, Stack, Title, useMantineTheme } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconCamera, IconCheck, IconX } from '@tabler/icons-react'
import Webcam from 'react-webcam'
import { useAccount } from 'wagmi'
import { Buffer } from 'buffer'

import { read, write } from '../wagmi-hooks'
import { TransactionExecutionError } from 'viem'

type NavigationState = { action: 'sign' | 'verify'; data: { pdfFile?: File } } | undefined

const notifyWaitingConfirmation = () =>
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

const notifyTransationConfirmed = () =>
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

const notifyTransactionRejected = () =>
  notifications.update({
    id: 'confirmation',
    title: 'Transação rejeitada',
    message: 'Por favor, tente novamente',
    color: 'red',
    icon: <IconX />,
    withBorder: true,
    autoClose: 3000,
  })

const notifySomethingWentWrong = () =>
  notifications.update({
    id: 'confirmation',
    title: 'Algo deu errado',
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
  const { address } = useAccount()

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
  }, [])

  async function captureFaceImages(amount: number) {
    // Takes a photo every 200ms
    // 10 photos in total
    await new Promise<void>(resolve =>
      Array.from({ length: amount }).forEach((_, i) => {
        setTimeout(
          async () => {
            const photoBase64 = webcamRef.current?.getScreenshot()!
            const fileBuffer = Buffer.from(photoBase64.replace(/^data:image\/\w+;base64,/, ''), 'base64')
            await window.electron.storeFaceImage(address!, `${i + 1}.jpg`, fileBuffer)
            if (i + 1 === amount) resolve()
          },
          200 * (i + 1)
        )
      })
    )
  }

  async function onCapture() {
    try {
      setLoading(true)

      const { pdfFile } = navigationState?.data || {}

      if (navigationState?.action === 'sign' && pdfFile) {
        let cid = await read({ functionName: 'getSignatoryCid', args: [address!] })

        if (cid) {
          // TODO: Verify face
        } else {
          // Create new model
          await captureFaceImages(10)

          // TODO: Handle face not detected
          await window.electron.runPythonScript({
            action: 'ADD_CLASS',
            data: {
              modelFile: `${address}.xml`,
              classPath: 'dataset/new_class',
            },
          })

          cid = await window.electron.uploadModelToFilecoin(address!)

          notifyWaitingConfirmation()
          await write({ functionName: 'setSignatoryCid', args: [cid] })
          notifyTransationConfirmed()
        }

        navigate('/pdf-stamp-add', { state: { data: { pdfFile } } })
      }

      if (navigationState?.action === 'verify') {
        navigate('/verification-success')
      }
    } catch (error) {
      if (error instanceof TransactionExecutionError) {
        notifyTransactionRejected()
      } else {
        console.error(error)
        notifySomethingWentWrong()
      }
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
