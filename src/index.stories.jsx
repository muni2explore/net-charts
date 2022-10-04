import React, { useMemo, useState } from "react"
import { ThemeProvider } from "styled-components"
import { DefaultTheme, DarkTheme } from "@netdata/netdata-ui"

import makeDefaultSDK from "@netdata/charts/dist/es6/makeDefaultSDK"
import noData from "@netdata/charts/dist/es6/fixtures/noData"
import systemLoadLineChart from "@netdata/charts/dist/es6/fixtures/systemLoadLineChart"
import systemLoadLine from "@netdata/charts/dist/es6/fixtures/systemLoadLine"
import Line from "@netdata/charts/dist/es6/components/line"
import makeMockPayload from "@netdata/charts/dist/es6/helpers/makeMockPayload"
import { camelizeKeys } from "@netdata/charts/dist/es6/helpers/objectTransform"


const getChartMetadata = () => camelizeKeys(systemLoadLineChart, { omit: ["dimensions"] })
const getChart = makeMockPayload(systemLoadLine[0], { delay: 600 })


export const Simple = () => {
    const sdk = makeDefaultSDK({ getChartMetadata })
    const chart = sdk.makeChart({ getChart })
    sdk.appendChild(chart)
  
    return (
      <ThemeProvider theme={DefaultTheme}>
        <Line chart={chart} height="315px" />
      </ThemeProvider>
    )
}

export default {
    title: "Charts",
    component: Simple,
}
  