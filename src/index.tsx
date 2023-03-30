import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState
} from 'react'

const ctxPromiseRaii = {
  count: createContext<number>(0),
  acquire: createContext<() => void>(() => {}),
  release: createContext<() => void>(() => {})
} as const

const useAcquire = () => useContext(ctxPromiseRaii.acquire)
const useRelease = () => useContext(ctxPromiseRaii.release)

export const ProviderPromiseRaii = (props: { children: ReactNode }) => {
  const [count, setCount] = useState<number>(0)
  const acquire = useCallback(() => setCount((p) => p + 1), [])
  const release = useCallback(() => setCount((p) => p - 1), [])
  return (
    <ctxPromiseRaii.acquire.Provider value={acquire}>
      <ctxPromiseRaii.release.Provider value={release}>
        <ctxPromiseRaii.count.Provider value={count}>
          {props.children}
        </ctxPromiseRaii.count.Provider>
      </ctxPromiseRaii.release.Provider>
    </ctxPromiseRaii.acquire.Provider>
  )
}

export const useCheckPromiseRaii = () => useContext(ctxPromiseRaii.count)

export const usePromiseRaii = () => {
  const acquire = useAcquire()
  const release = useRelease()

  return useCallback(
    async <T,>(promise: Promise<T>) => {
      try {
        acquire()
        return await promise
      } finally {
        release()
      }
    },
    [acquire, release]
  )
}

export const usePromiseRaiiSleep = () => {
  const acquire = useAcquire()
  const release = useRelease()
  const returnValueIndex = 0

  return useCallback(
    async <T,>(promise: Promise<T>, ms: number = 100) => {
      try {
        acquire()
        return (
          await Promise.all([
            promise,
            new Promise((resolve) => setTimeout(resolve, ms))
          ])
        )[returnValueIndex]
      } finally {
        release()
      }
    },
    [acquire, release]
  )
}

export const usePromiseRaiiArray = () => {
  const acquire = useAcquire()
  const release = useRelease()

  return useCallback(
    async <T,>(promiseArray: Promise<T>[]) => {
      try {
        acquire()
        return await Promise.all(promiseArray)
      } finally {
        release()
      }
    },
    [acquire, release]
  )
}
