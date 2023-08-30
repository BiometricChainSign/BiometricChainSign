import { ActionIcon, Button, Stack } from '@mantine/core'
import { IconCamera, IconX } from '@tabler/icons-react'
import { useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Webcam from 'react-webcam'

const videoConstraints = {
  // width: 1280,
  // height: 720,
  facingMode: 'user',
}

export function FaceCapturePage() {
  const webcamRef = useRef<Webcam>(null)
  const navigate = useNavigate()

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot()
    console.log(imageSrc)
  }, [webcamRef])

  return (
    <Stack align='center'>
      <Webcam
        audio={false}
        width='100%'
        height={720}
        ref={webcamRef}
        screenshotFormat='image/jpeg'
        videoConstraints={videoConstraints}
      />

      <ActionIcon onClick={capture} size='xl' color='indigo' variant='filled'>
        <IconCamera />
      </ActionIcon>

      <Button onClick={() => navigate('/document-select')} leftIcon={<IconX />} variant='light' color='red'>
        Cancelar
      </Button>
    </Stack>
  )
}
