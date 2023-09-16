import { useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { PDFDocument } from 'pdf-lib'
import { pdfjs, Document, Page } from 'react-pdf'
import { Rnd } from 'react-rnd'
import { Canvg } from 'canvg'
import Stamp from '../components/stamp'
import { useAccount } from 'wagmi'
import { ActionIcon, Button, Flex, Group, Stack, Title, createStyles } from '@mantine/core'
import { IconArrowLeft, IconArrowRight, IconDeviceFloppy } from '@tabler/icons-react'

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

type NavigationState = { data: { pdfFile: File } }

const useStyles = createStyles(theme => ({
  documentWrapper: {
    margin: '0 auto',
    marginBottom: 140,
    border: `4px solid ${theme.colors.indigo[1]}`,
    // borderRadius: theme.radius.lg,
    alignSelf: 'baseline',
  },
  document: {
    position: 'relative',
  },
  rnd: {
    zIndex: 2,
  },
  bottomBar: {
    borderRadius: theme.radius.md,
    boxShadow: theme.shadows.xl,
  },
}))

function PdfStampAddPage() {
  const location = useLocation()
  const navigationState = location.state as NavigationState
  const { pdfFile } = navigationState.data
  const stampSvgRef = useRef<SVGSVGElement | null>(null)
  const [pageCount, setPageCount] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const [stampSize, setStampSize] = useState<{ width: number; height: number }>({
    width: 180,
    height: 60,
  })

  const [stampPosition, setStampPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  })

  const { address } = useAccount()
  const { classes } = useStyles()

  const stampDate = useMemo(() => {
    const date = new Date()
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    const hour = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const tz = (date.getTimezoneOffset() / 60) * -1

    return `${day}/${month}/${year} ${hour}:${minutes} UTC ${tz}`
  }, [])

  function onPdfLoadSuccess({ numPages }: { numPages: number }) {
    setPageCount(numPages)
  }

  async function savePdf() {
    const width = stampSize.width / 1.4
    const height = stampSize.height / 1.4
    const x = stampPosition.x / 1.4
    const y = stampPosition.y / 1.4
    const svgScaling = 4
    const svgElem = stampSvgRef.current!.cloneNode(true) as SVGSVGElement
    svgElem.setAttribute('width', (width * svgScaling).toString())
    svgElem.setAttribute('height', (height * svgScaling).toString())

    // Create a canvas and render SVG on it
    const canvas = document.createElement('canvas')
    canvas.width = width * svgScaling
    canvas.height = height * svgScaling
    const ctx = canvas.getContext('2d')!
    Canvg.fromString(ctx!, svgElem.outerHTML).start()

    // Load the PDF
    const existingPdfBytes = await pdfFile!.arrayBuffer()
    const pdfDoc = await PDFDocument.load(existingPdfBytes)

    // Draw the canvas onto the first page of the PDF
    const page = pdfDoc.getPage(currentPage - 1)
    const image = await pdfDoc.embedPng(canvas.toDataURL('image/png'))

    page.drawImage(image, { x, y: page.getHeight() - (y + height), width, height })

    // Serialize the edited PDF and download it
    const editedPdfBytes = await pdfDoc.save()
    const blob = new Blob([editedPdfBytes], { type: 'application/pdf' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = pdfFile.name.replace('.pdf', '') + ` - ${address?.slice(0, 12)}.pdf`
    link.click()
  }

  return (
    <>
      <Group w='100%' pos='fixed' bottom={40} left={0} position='center' style={{ zIndex: 3 }}>
        <Group position='center' px={20} py={10} bg='white' className={classes.bottomBar}>
          <ActionIcon
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            color='indigo'
            size='lg'
          >
            <IconArrowLeft />
          </ActionIcon>
          {currentPage}
          <ActionIcon
            disabled={currentPage === pageCount}
            onClick={() => setCurrentPage(currentPage + 1)}
            color='indigo'
            size='lg'
            mr='lg'
          >
            <IconArrowRight />
          </ActionIcon>

          <Button onClick={savePdf} leftIcon={<IconDeviceFloppy />} size='md'>
            Salvar
          </Button>
        </Group>
      </Group>

      <Stack align='center'>
        <Title>Adicionar carimbo</Title>

        <Flex justify='center' className={classes.documentWrapper}>
          <Document file={pdfFile} onLoadSuccess={onPdfLoadSuccess} className={classes.document}>
            <Rnd
              size={stampSize}
              position={stampPosition}
              onDragStop={(event, { x, y }) => setStampPosition({ x, y })}
              onResize={(event, direction, ref, delta, position) => {
                setStampSize({ width: parseInt(ref.style.width), height: parseInt(ref.style.height) })
                setStampPosition(position)
              }}
              bounds='parent'
              lockAspectRatio
              className={classes.rnd}
            >
              <Stamp
                width={stampSize.width}
                height={stampSize.height}
                address={address!}
                date={stampDate}
                ref={stampSvgRef}
              />
            </Rnd>

            <Page pageNumber={currentPage} renderTextLayer={false} renderAnnotationLayer={false} scale={1.4} />
          </Document>
        </Flex>
      </Stack>
    </>
  )
}

export default PdfStampAddPage
