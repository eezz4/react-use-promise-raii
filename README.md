# react-use-promise-raii

[![NPM](https://img.shields.io/npm/v/react-use-promise-raii.svg)](https://www.npmjs.com/package/react-use-promise-raii) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-use-promise-raii
```

## Usage

#### global blocking io : example1 + example2 + example3

- example1: provider installation is required.
```tsx
import { ProviderPromiseRaii } from "react-use-promise-raii";

export default function App() {
  return (
    <>
      <GlobalStyle />
      <ProviderPromiseRaii>
        <HomePage/>
      </ProviderPromiseRaii>
    </>
  );

```

- example2: When you need global blocking...
```tsx
import { useCheckPromiseRaii } from "react-use-promise-raii";

const useBlockingIoPreventKeyEvents = (isBlocking: boolean) => {
  const preventer = useMemo(() => {
    const keyEventArr = ['keydown', 'keypress', 'keyup']
    const onKeyEvent = (e: Event) => e.preventDefault()
    const regist = () => {
      keyEventArr.forEach((keyEvent) => {
        document.addEventListener(keyEvent, onKeyEvent)
      })
    }
    const unregist = () => {
      keyEventArr.forEach((keyEvent) => {
        document.removeEventListener(keyEvent, onKeyEvent)
      })
    }
    return { regist, unregist }
  }, [])

  useEffect(() => {
    if (isBlocking) {
      preventer.regist()
    } else {
      preventer.unregist()
    }
  }, [isBlocking, preventer])
}

export const BlockingIo = () => {
  const isBlocking = useCheckPromiseRaii() > 0 // useCheckPromiseRaii

  useBlockingIoPreventKeyEvents(isBlocking)

  return (
    <WrBlockingIo isBlocking={isBlocking}>
      <Watch visible={isBlocking} color={'#ffffff'} width={80} height={80} />
    </WrBlockingIo>
  )
}

const WrBlockingIo = styled.div<{ isBlocking: boolean }>`
  visibility: ${(props) => (props.isBlocking ? 'visible' : 'hidden')};

  z-index: ${zIndex.blocking};
  position: fixed;
  width: 100%;
  height: 100%;

  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`
```

- example3: When you want to delay a promise.
```ts
import { usePromiseRaiiSleep } from "react-use-promise-raii";

export const useAxios = () => {
  const raiiSleep = usePromiseRaiiSleep();

  const axiosGet = useCallback(
    async (queryKey: string) => {
      if (queryKey.length === 0) return null;
      const { data } = await raiiSleep(axios.get(queryKey, axiosConfig), 1000);
      return data;
    },
    [raiiSleep]
  );

  // ...

  return {axiosGet, ... }
}
```

## License

MIT © [eezz4](https://github.com/eezz4)
