/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useEffect, useLayoutEffect } from "react"

import { CAN_USE_DOM } from "@/registry/new-york-v4/editor/shared/can-use-dom"

// This workaround is no longer necessary in React 19,
// but we currently support React >=17.x
// https://github.com/facebook/react/pull/26395
const useLayoutEffectImpl: typeof useLayoutEffect = CAN_USE_DOM
  ? useLayoutEffect
  : useEffect

export default useLayoutEffectImpl
