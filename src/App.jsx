import React, { useEffect } from 'react'
import { ThemeProvider } from "styled-components"
import { DefaultTheme, DarkTheme, H1, Flex } from "@netdata/netdata-ui"
import Line from "@netdata/charts/dist/es6/components/line"
import GaugeComponent from "@netdata/charts/dist/es6/components/gauge";
import EasyPie from "@netdata/charts/dist/es6/components/easyPie";
import systemIoInGaugePie from "@netdata/charts/dist/es6/fixtures/systemIoInGaugePie"

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

const getGaugeChart = makeMockPayload(systemIoInGaugePie, { delay: 600 })

function App() {

  const key = "CO2Sensor";

  // const fromTimestamp = Date.now() - 10 * 60 * 1000
  const fromTimestamp = Date.now()
  const firstEntry = Math.floor(fromTimestamp / 1000)

  // const after = firstEntry - 100 * 60
  const after = firstEntry - 60 * 60
  const before = after + 60 * 60

  /**
   * Normal Netdata Chart
   */
  //  getChartMetadata: () => ({ ...getChartMetadata(), firstEntry }),
  //  attributes: { after, before },
  const sdk = makeDefaultSDK({ getChartMetadata, attributes: { after, before }, })
  const chart = sdk.makeChart({ getChart, autofetch: false, attributes: { theme: "dark" }, })



  /**
   * Custom Our Chart
   */
  const fdata = formatData(data.data, key);
  const ourchart = sdk.makeChart(
    { 
      getChart: (chart) => { 
        console.log('ourchart-----', chart);
        // console.log("Custom Our Chart getChart------", chart);
        // return new Promise(r => setTimeout(() => r(dd), 600))
        return new Promise(r => setTimeout(() => r(fdata), 600))
      },
      autofetch: false,
      attributes: { theme: "dark" }, 
    }
  )

  console.log(ourchart.cancelFetch());

  /**
   * No data Chart
   */
   const no_data_chart = sdk.makeChart(
    { 
      getChart: (chart) => {
        console.log('no_data_chart-----', chart);
        return new Promise(r => setTimeout(() => r(noData), 600))},
      attributes: { theme: "dark" },
    }
  )

  /**
   * Simple Gauge
   */
  const gaugeChart = sdk.makeChart({
    getChart: getGaugeChart,
    attributes: { updateEvery: 1, chartLibrary: "gauge", units: "percentage" },
  })
  sdk.appendChild(gaugeChart)

  console.log(JSON.stringify(fdata));
  /**
   * Pie Chart
   */
  const pieChart = sdk.makeChart({
    //getChart,
    getChart: (chart) => { 
      // console.log("Custom Our Chart getChart------", chart);
      // return new Promise(r => setTimeout(() => r(dd), 600))

      
      const d = {
        result: {
          data: [[1665100539686, 522.71]]
        }
      }
      return new Promise(r => setTimeout(() => r(d), 600))
    },
    attributes: { updateEvery: 1, chartLibrary: "easypiechart" },
  })
  sdk.appendChild(pieChart)

  sdk.appendChild(chart)
  sdk.appendChild(ourchart)
  sdk.appendChild(no_data_chart)
  sdk.appendChild(gaugeChart)
  sdk.appendChild(pieChart)

  return (
    <ThemeProvider theme={DarkTheme}>
      <Flex background="mainBackground" width="100%">
        <div className="App" width="100%">
            {/* <Flex column margin={[10, 0, 25, 0]} width="100%">
              <H1>Simple Chart</H1>
              <Line chart={chart} height="315px" />
            </Flex> */}

            <Flex column margin={[10, 0, 25, 0]} width="100%">
              <H1>Our Custom Data - Chart</H1>
              <Line chart={ourchart} height="315px" />
            </Flex>

            <Flex column margin={[10, 0, 25, 0]} width="100%">
              <H1>No Data Chart</H1>
              <Line chart={no_data_chart} height="315px" />
            </Flex>

            <Flex width="180px" margin={[10, 0, 25, 0]}>
              <GaugeComponent chart={gaugeChart} />
            </Flex>

            <Flex width="400px" margin={[10, 0, 25, 0]}>
              <EasyPie chart={pieChart} />
            </Flex>
        </div>
      </Flex>
    </ThemeProvider>
  )
}

export default App
