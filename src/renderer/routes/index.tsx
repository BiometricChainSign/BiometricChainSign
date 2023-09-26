import { useEffect } from 'react'
import { HashRouter, Navigate, Outlet, Route, Routes as Switch, useLocation } from 'react-router-dom'

import { useAccount, useNetwork } from 'wagmi'
import { Stack } from '@mantine/core'

import Bar from '../components/bar'

import ConnectPage from '../pages/connect'
import DocumentSelectPage from '../pages/document-select'
import FaceCapturePage from '../pages/face-capture'
import SignatoryAddressesPage from '../pages/signatory-addresses'
import VerificationSuccessPage from '../pages/verification-success'
import SigningSuccessPage from '../pages/signing-success'
import PdfStampAddPage from '../pages/pdf-stamp-add'
import { contract } from '../contract'
import { readMainnet, readSepolia, writeMainnet, writeSepolia } from '../wagmi-generated'

function Layout() {
  const location = useLocation()
  const { isConnected } = useAccount()
  const network = useNetwork()

  useEffect(() => {
    const networkName = network.chain?.name.toLowerCase()

    if (networkName === 'sepolia') {
      contract.read = readSepolia
      contract.write = writeSepolia
    }

    if (networkName === 'mainnet') {
      contract.read = readMainnet
      contract.write = writeMainnet
    }
  }, [network])

  if (location.pathname !== '/' && !isConnected) {
    return <Navigate to='/' />
  }

  if (location.pathname === '/' && isConnected) {
    return <Navigate to='/document-select' />
  }

  return (
    <Stack w='100%' maw='1200px' mih='100vh' mx='auto' px='xs' spacing='lg'>
      <Bar />
      <Outlet />
    </Stack>
  )
}

export default function Routes() {
  return (
    <HashRouter>
      <Switch>
        <Route element={<Layout />}>
          <Route path='/' element={<ConnectPage />} />
          <Route path='/document-select' element={<DocumentSelectPage />} />
          <Route path='/face-capture' element={<FaceCapturePage />} />
          <Route path='/pdf-stamp-add' element={<PdfStampAddPage />} />
          <Route path='/signatory-addresses' element={<SignatoryAddressesPage />} />
          <Route path='/signing-success' element={<SigningSuccessPage />} />
          <Route path='/verification-success' element={<VerificationSuccessPage />} />
        </Route>
      </Switch>
    </HashRouter>
  )
}
