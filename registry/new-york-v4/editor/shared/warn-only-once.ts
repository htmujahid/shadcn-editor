/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export function warnOnlyOnce(message: string) {
  if (process.env.NODE_ENV === "production") {
    return
  }
  let run = false
  return () => {
    if (!run) {
      console.warn(message)
    }
    run = true
  }
}
