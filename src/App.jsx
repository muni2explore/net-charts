import React, { useEffect } from 'react'
import './App.css'
import { ThemeProvider } from "styled-components"
import { DefaultTheme, DarkTheme } from "@netdata/netdata-ui"
import Line from "@netdata/charts/dist/es6/components/line"
import makeDefaultSDK from "@netdata/charts/dist/es6/makeDefaultSDK";
import noData from "@netdata/charts/dist/es6/fixtures/noData";
import systemLoadLineChart from "@netdata/charts/dist/es6/fixtures/systemLoadLineChart";
import systemLoadLine from "@netdata/charts/dist/es6/fixtures/systemLoadLine";
import makeMockPayload from "@netdata/charts/dist/es6/helpers/makeMockPayload"

import { camelizeKeys } from "@netdata/charts/dist/es6/helpers/objectTransform"


const getChartMetadata = () => camelizeKeys(systemLoadLineChart, { omit: ["dimensions"] })
const getChart = makeMockPayload(systemLoadLine[0], { delay: 600 })

function App() {
  const sdk = makeDefaultSDK({ getChartMetadata })
  const chart = sdk.makeChart({ getChart })
  sdk.appendChild(chart)

  return (
    <div className="App">
      <ThemeProvider theme={DefaultTheme}>
        <Line chart={chart} height="315px" />
      </ThemeProvider>
    </div>
  )
}

export default App
