import { activeHeartIcon, externalLinkIcon, heartIcon, refreshIcon, slidersIcon } from "./Icons"
import IntentGroup from "./IntentGroup"

const { widget } = figma
const { useEffect, usePropertyMenu, useSyncedState, AutoLayout, Input, Text, Image } = widget

interface Tweet {
  text: string
  publicMetrics: {
    retweetCount: number
    likeCount: number
    replyCount: number
  }
  author: {
    name: string
    username: string
    verified: boolean
    profileImageURI?: string
  }
}

function Widget() {
  const [tweetIdInput, setTweetIdInput] = useSyncedState("tweetIdInput", "")
  const [tweet, setTweet] = useSyncedState<Tweet | null>("tweet", null)

  usePropertyMenu(
    [
      {
        tooltip: "Open Tweet",
        propertyName: "open",
        itemType: "action",
        icon: externalLinkIcon,
      },
      {
        tooltip: "Refresh Tweet",
        propertyName: "refresh",
        itemType: "action",
        icon: refreshIcon,
      },
      {
        tooltip: "Edit Tweet",
        propertyName: "edit",
        itemType: "action",
        icon: slidersIcon,
      },
    ],
    (e) => {
      switch (e.propertyName) {
        case "open":
          break
        case "refresh":
          break
        case "edit":
          setTweet(null)
          break
        default:
          break
      }
    }
  )

  useEffect(() => {
    figma.ui.onmessage = (msg) => {
      if (msg.type === "showToast") {
        figma.notify("Hello widget")
      }
      if (msg.type === "close") {
        figma.closePlugin()
      }
    }
  })

  return (
    <AutoLayout
      name="body"
      padding={32}
      spacing={32}
      cornerRadius={16}
      width={384}
      direction="vertical"
      horizontalAlignItems="start"
      verticalAlignItems="center"
      fill="#ffffff"
      effect={{
        type: "drop-shadow",
        color: { r: 0, g: 0, b: 0, a: 0.15 },
        offset: { x: 0, y: 4 },
        blur: 12,
      }}
    >
      {tweet ? (
        <>
          <AutoLayout
            name="author-container"
            spacing={8}
            direction="horizontal"
            horizontalAlignItems="start"
            verticalAlignItems="center"
            width="fill-parent"
          >
            {tweet.author.profileImageURI && (
              <Image src={tweet.author.profileImageURI} width={48} height={48} cornerRadius={48} />
            )}
            <AutoLayout
              name="author-container"
              spacing={4}
              direction="vertical"
              horizontalAlignItems="start"
              verticalAlignItems="center"
              width="fill-parent"
            >
              <Text fontSize={16} fontWeight={500} width="fill-parent">
                {tweet.author.name}
              </Text>
              <Text fontSize={16} fontWeight={500} width="fill-parent">
                @{tweet.author.username}
              </Text>
            </AutoLayout>
          </AutoLayout>

          <Text fontSize={16} fontWeight={500} width="fill-parent">
            {tweet.text}
          </Text>

          <AutoLayout
            name="metrics-container"
            spacing={8}
            direction="horizontal"
            horizontalAlignItems="start"
            verticalAlignItems="center"
          >
            <AutoLayout
              name="reply-container"
              spacing={2}
              direction="horizontal"
              horizontalAlignItems="center"
              verticalAlignItems="center"
            >
              <Image
                width={24}
                height={24}
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAYAAACprHcmAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAECSURBVHgBpY87TwJBFIXPnVkhbqQQE7UQNWhrsdpLI40FsdSYGGNvbWFhZ2Jj+AWER0fFD6CAhhYCod8GGmCLJRAI2Rl22LDh1RBOc1/fzb0H2EK0WPSfzj+lxG3wMIpAOKpaZfpPpddgKxG510BllSsw6MGAEAYl0zWVMn+L8boEzOXD0oRwrI1vZF9ESRetWO94XMjEDwxb0xttTF6txyNbzbU5mHmWhhtiQ3aGSkQmTH129YJLunJjdQned9DshkbF8d7o4cRiOSB0475ld+JUnTM+/Pb1d0p8ck2eKXN49/OOFfkGOXfCLnjpdamNDfLhgfFdIyE+GOg3AJHHrpoC5YtKfAfixH0AAAAASUVORK5CYII="
              />
              <Text fontSize={12} fontWeight={400}>
                {tweet.publicMetrics.replyCount}
              </Text>
            </AutoLayout>

            <IntentGroup
              name="retweet-intent"
              count={tweet.publicMetrics.retweetCount}
              foregroundFill="#00ba7c"
              backgroundFill="#def1eb"
              icon={heartIcon}
              activeIcon={activeHeartIcon}
            />

            <IntentGroup
              name="like-intent"
              count={tweet.publicMetrics.likeCount}
              foregroundFill="#f91880"
              backgroundFill="#f7e0eb"
              icon={heartIcon}
              activeIcon={activeHeartIcon}
            />
          </AutoLayout>
        </>
      ) : (
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
              Tweet ID
            </Text>
            <Input
              value={tweetIdInput}
              placeholder="1585396100026208257"
              onTextEditEnd={(e) => {
                setTweetIdInput(e.characters)
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
            fill="#1d9bf0"
            onClick={async () =>
              new Promise((resolve) => {
                figma.showUI(__html__, { visible: false })
                figma.ui.postMessage({ type: "fetch-tweet", id: tweetIdInput })
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
      )}
    </AutoLayout>
  )
}

widget.register(Widget)

// TODO
// - [ ] intents (retweet, like, comment)
// - [ ] annotated text
// - [ ] image cards
// - [ ] gif cards
// - [ ] video cards
