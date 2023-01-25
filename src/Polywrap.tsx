import React, { useEffect, useState } from "react"
import { PolywrapClient, Uri } from "@polywrap/client-js"
import { ClientConfigBuilder } from "@polywrap/client-config-builder-js"
import { ethereumPlugin, Connections, Connection } from "@polywrap/ethereum-plugin-js"
import { ipfsPlugin } from "@polywrap/ipfs-plugin-js"

type PolywrapData = {
  data: unknown
  error: string | null
  loading: boolean
}

const Polywrap: React.VFC = () => {
  const [client, setClient] = useState<PolywrapClient>();

  useEffect(() => {
    (async () => {
      const ethereum = (window as any).ethereum;
      if (ethereum) {
        console.log("HERE")
        await ethereum.request({ method: 'eth_requestAccounts' });
      } else {
        throw Error('Please install Metamask.');
      }

      console.log(ethereum)
  
      const DEFAULT_CONFIG = new ClientConfigBuilder().addDefaults().addPackage({
        uri: "ens/ethereum.polywrap.eth",
        package: ethereumPlugin({
          connections: new Connections({
            networks: {
              polygon: new Connection({
                provider:
                  ethereum,
              }),
            },
          }),
        }),
      }).addPackage({
        uri: "wrap://ens/ipfs.polywrap.eth",
        package: ipfsPlugin({}),
      })
      .addRedirect(
        "ens/uniswapv3.eth",
        "ipfs/Qmc5dZfDnBcSm9tjNbMExyt9MVKXUwFzy4kqRZhFMiUBxo"
      ).build()
  
      const client = new PolywrapClient(DEFAULT_CONFIG)

      setClient(client)
    })();
    
  }, [])

  return (
    <button onClick={async () => {
      const g = await client?.tryResolveUri(Uri.from("ipfs/Qmc5dZfDnBcSm9tjNbMExyt9MVKXUwFzy4kqRZhFMiUBxo"));

      console.log(g);
      const result = await client!.invoke({
        uri: "ipfs/Qmc5dZfDnBcSm9tjNbMExyt9MVKXUwFzy4kqRZhFMiUBxo",
        method: "mintPosition",
        args: {
          poolAddress: "0x45dda9cb7c25131df268515131f647d726f50608",
          amount: "0.001",
          chainId: 9,
          deadline: (Math.floor(Date.now() / 1000) + 600).toString(),
        }
      });

      console.log(result)

    }}>Invoke</button>
  )
}

export default Polywrap
