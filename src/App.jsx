import React, { useEffect } from 'react'
import { ThemeProvider } from "styled-components"
import { DefaultTheme, DarkTheme, H1, Flex } from "@netdata/netdata-ui"
import Line from "@netdata/charts/dist/es6/components/line"
import makeDefaultSDK from "@netdata/charts/dist/es6/makeDefaultSDK";
import noData from "@netdata/charts/dist/es6/fixtures/noData";
import systemLoadLineChart from "@netdata/charts/dist/es6/fixtures/systemLoadLineChart";
import systemLoadLine from "@netdata/charts/dist/es6/fixtures/systemLoadLine";
import makeMockPayload from "@netdata/charts/dist/es6/helpers/makeMockPayload"

import { camelizeKeys } from "@netdata/charts/dist/es6/helpers/objectTransform"
import data from './data.json';
import { formatData, dd } from './util'


const getChartMetadata = () => camelizeKeys(systemLoadLineChart, { omit: ["dimensions"] })
const getChart = makeMockPayload(systemLoadLine[0], { delay: 600 })

function App() {

  const key = "CO2Sensor";

  /**
   * Normal Netdata Chart
   */
  const sdk = makeDefaultSDK({ getChartMetadata })
  const chart = sdk.makeChart({ getChart, attributes: { theme: "dark" }, })



  /**
   * Custom Our Chart
   */
  const fdata = formatData(data.data, key);
  const ourchart = sdk.makeChart(
    { 
      getChart: (chart) => { 
        // console.log("getChart------", chart);
        // return new Promise(r => setTimeout(() => r(dd), 600))
        return new Promise(r => setTimeout(() => r(fdata), 600))
      },
      attributes: { theme: "dark" }, 
    }
  )

  /**
   * No data Chart
   */
   const no_data_chart = sdk.makeChart(
    { 
      getChart: (chart) => new Promise(r => setTimeout(() => r(noData), 600)),
      attributes: { theme: "dark" }, 
    }
  )

  sdk.appendChild(chart)
  sdk.appendChild(ourchart)
  sdk.appendChild(no_data_chart)

  return (
    <ThemeProvider theme={DarkTheme}>
      <Flex background="mainBackground" width="100%">
        <div className="App" width="100%">
            <Flex column margin={[10, 0, 25, 0]} width="100%">
              <H1>Simple Chart</H1>
              <Line chart={chart} height="315px" />
            </Flex>

            <Flex column margin={[10, 0, 25, 0]} width="100%">
              <H1>Our Custom Data - Chart</H1>
              <Line chart={ourchart} height="315px" />
            </Flex>

            <Flex column margin={[10, 0, 25, 0]} width="100%">
              <H1>No Data Chart</H1>
              <Line chart={no_data_chart} height="315px" />
            </Flex>
        </div>
      </Flex>
    </ThemeProvider>
  )
}

export default App
