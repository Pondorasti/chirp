import { Tweet } from "./code"
import { twitterBlue } from "./Icons"

const { widget } = figma
const { useSyncedState, AutoLayout, Input, Text } = widget

export default function Form() {
  const [tweetInput, setTweetInput] = useSyncedState("tweetInput", "")
  const [, setTweet] = useSyncedState<Tweet | null>("tweet", null)

  return (
    <>
      <Text fontSize={24} fontWeight={600}>
        Chirp
      </Text>

      <AutoLayout
        name="input-container"
        spacing={8}
        direction="vertical"
        horizontalAlignItems="start"
        verticalAlignItems="center"
        width="fill-parent"
      >
        <Text fontSize={16} fontWeight={500}>
          Tweet URL/ID
        </Text>
        <Input
          value={tweetInput}
          placeholder="1585396100026208257"
          onTextEditEnd={(e) => {
            setTweetInput(e.characters)
          }}
          fontSize={16}
          fill="#525252"
          inputFrameProps={{
            fill: "#f5f5f5",
            cornerRadius: 12,
            padding: 8,
          }}
          inputBehavior="wrap"
          width="fill-parent"
        />
      </AutoLayout>
      <AutoLayout
        name="create-tweet"
        padding={12}
        cornerRadius={16}
        direction="vertical"
        horizontalAlignItems="center"
        verticalAlignItems="center"
        width="fill-parent"
        fill={twitterBlue}
        onClick={() =>
          new Promise((resolve) => {
            figma.showUI(__html__, { visible: false })

            // get id after the last slash and trim everything after question mark
            // ex: https://twitter.com/lavieestbelIe/status/1589649527195115520?s=20&t=IMsQCAsl6pkN0QO9EcTKLA → 1589649527195115520
            // ex: https://twitter.com/lavieestbelIe/status/1589649527195115520 → 1589649527195115520
            const potentialId = tweetInput.split("/").pop()?.split("?").shift()

            if (tweetInput.includes("https://twitter.com") && potentialId) {
              figma.ui.postMessage({ type: "fetch-tweet", id: potentialId })
            } else if (tweetInput.match(/^\d+$/)) {
              figma.ui.postMessage({ type: "fetch-tweet", id: tweetInput })
            } else {
              figma.notify("⚠️ Invalid tweet input")
              resolve(null)
            }

            figma.ui.onmessage = (tweet) => {
              setTweet(tweet)
              resolve(null)
            }
          })
        }
      >
        <Text fill="#fff" fontWeight={600} fontSize={18}>
          Embed
        </Text>
      </AutoLayout>
    </>
  )
}