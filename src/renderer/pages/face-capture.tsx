import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  ActionIcon,
  AspectRatio,
  Box,
  Button,
  Image,
  Loader,
  LoadingOverlay,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconCamera, IconCheck, IconReload, IconX } from '@tabler/icons-react'
import Webcam from 'react-webcam'
import { TransactionExecutionError } from 'viem'
import { useAccount } from 'wagmi'
import { Buffer } from 'buffer'

import { contract } from '../contract'

type NavigationState = { action: 'sign' | 'verify'; data: { pdfFile?: File } } | undefined

const notifyWaitingConfirmation = () =>
  notifications.show({
    id: '1',
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
    id: '1',
    title: 'Sucesso',
    message: 'Transação confirmada!',
    color: 'indigo',
    icon: <IconCheck />,
    withBorder: true,
    autoClose: 5000,
  })

const notifyFaceNotDetected = () =>
  notifications.show({
    id: '1',
    title: 'Não foi possível detectar sua face',
    message: 'Por favor, tente novamente',
    color: 'red',
    icon: <IconX />,
    withBorder: true,
    autoClose: 5000,
  })

const notifyFaceNotRecognized = () =>
  notifications.show({
    id: '1',
    title: 'Não foi possível reconhecer sua face',
    message: 'Por favor, tente novamente',
    color: 'red',
    icon: <IconX />,
    withBorder: true,
    autoClose: 5000,
  })

const notifyTransactionRejected = () =>
  notifications.update({
    id: '1',
    title: 'Transação rejeitada',
    message: 'Por favor, tente novamente',
    color: 'red',
    icon: <IconX />,
    withBorder: true,
    autoClose: 5000,
  })

const notifySomethingWentWrong = () =>
  notifications.show({
    id: '1',
    title: 'Algo deu errado',
    message: 'Por favor, tente novamente',
    color: 'red',
    icon: <IconX />,
    withBorder: true,
    autoClose: 5000,
  })

export default function FaceCapturePage() {
  const [loading, setLoading] = useState(false)
  const [lastCapturedPhoto, setLastCapturedPhoto] = useState<string | null>(null)
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

            if (i + 1 === amount) {
              setLastCapturedPhoto(photoBase64)
              resolve()
            }
          },
          200 * (i + 1)
        )
      })
    )
  }

  async function addClass() {
    await captureFaceImages(10)

    const addClassResult = await window.electron.runScript({
      action: 'ADD_CLASS',
      data: {
        modelFile: `${address}.xml`,
        classPath: 'dataset/new_class',
      },
    })

    if (typeof addClassResult === 'string' && addClassResult.includes('ValueError: No new classes have been added.')) {
      throw new Error('FaceNotDetected')
    }

    const cid = await window.electron.uploadModelToFilecoin(address!)

    notifyWaitingConfirmation()
    await contract.write({ functionName: 'setSignatoryCid', args: [cid] })
    notifyTransationConfirmed()
  }

  async function testImage(cid: string) {
    await captureFaceImages(1)
    await window.electron.downloadModelFromFilecoin(cid, address!)

    const testImageResult = (await window.electron.runScript({
      action: 'TEST_IMG',
      data: {
        modelFile: `${address}.xml`,
        testImagePath: `dataset/new_class/${address}/1.jpg`,
      },
    })) as { label: number | null; confidence: number | null }

    if (!testImageResult.confidence) {
      throw new Error('FaceNotRecognized')
    }
  }

  async function onCapture() {
    if (!webcamRef.current?.getScreenshot()) return

    try {
      setLoading(true)

      const { pdfFile } = navigationState?.data || {}
      const cid = await contract.read({ functionName: 'getSignatoryCid', args: [address!] })

      if (navigationState?.action === 'sign' && pdfFile) {
        if (cid) {
          await testImage(cid)
        } else {
          await addClass()
        }

        navigate('/pdf-stamp-add', { state: { data: { pdfFile } } })
      }

      if (navigationState?.action === 'verify') {
        await testImage(cid)
        navigate('/verification-success')
      }
    } catch (error) {
      if (error instanceof TransactionExecutionError) {
        notifyTransactionRejected()
      } else if (error instanceof Error && error.message === 'FaceNotDetected') {
        notifyFaceNotDetected()
      } else if (error instanceof Error && error.message === 'FaceNotRecognized') {
        notifyFaceNotRecognized()
      } else {
        console.error(error)
        notifySomethingWentWrong()
      }
    }

    setLastCapturedPhoto(null)
    setLoading(false)
    window.electron.cleanupModelFiles(address!)
  }

  const theme = useMantineTheme()

  return (
    <Stack h='100%' justify='center' align='center' style={{ flexGrow: 1 }}>
      <Stack spacing='xs' align='center'>
        <Title>Captura de face</Title>
        <Text color='dimmed'>Mantenha sua face centralizada e clique no botão para capturar</Text>
      </Stack>

      <AspectRatio ratio={1} w='100%' maw={400} mx='auto' bg='black' style={{ borderRadius: theme.radius.md }}>
        <LoadingOverlay visible={!!lastCapturedPhoto && loading} style={{ borderRadius: theme.radius.md }} />

        <Box style={{ borderRadius: theme.radius.md }}>
          {!lastCapturedPhoto && <Loader m='auto' />}

          {!lastCapturedPhoto && (
            <Webcam
              audio={false}
              width='100%'
              height='100%'
              ref={webcamRef}
              screenshotFormat='image/jpeg'
              videoConstraints={{ width: 1000, height: 1000 }}
              style={{ position: 'absolute', zIndex: 2, borderRadius: theme.radius.md }}
            />
          )}

          {!!lastCapturedPhoto && <Image src={lastCapturedPhoto} />}

          {!loading && (
            <ActionIcon
              onClick={onCapture}
              size='xl'
              variant='filled'
              color='indigo'
              style={{ position: 'absolute', bottom: 20, margin: '0 auto', zIndex: 4 }}
            >
              <IconCamera />
            </ActionIcon>
          )}
        </Box>
      </AspectRatio>

      <Button onClick={() => navigate('/document-select')} leftIcon={<IconX />} variant='light' color='red'>
        Cancelar
      </Button>
    </Stack>
  )
}
