import clsx from "clsx"
import Image from "next/image"
import { ITweet } from "../../pages/api/tweet/[id]"
import { HeartIcon, ImpressionIcon, ReplyIcon, RetweetIcon, TwitterIcon } from "./icons"
import { TiltWrapper } from "./tilt"

const TRANSFORM_ANIMATION = "transition-all duration-[600ms] [transition-timing-function:ease] will-change-transform"
const PARALLAX_STYLE = "group-hover:[transform:translateZ(15px)]"
const ICON_STYLE = "p-[7px] rounded-full box-content"

interface MediaGroupProps {
  media: ITweet["media"]
}

const MediaGroup: React.FC<Readonly<MediaGroupProps>> = ({ media }) => {
  switch (media.length) {
    case 0: {
      return null
    }

    default: {
      const item = media[0]
      return (
        <Image
          src={item.uri}
          alt=""
          width={item.width}
          height={item.height}
          className={clsx("rounded-xl", PARALLAX_STYLE, TRANSFORM_ANIMATION)}
        />
      )
    }
  }
}

interface IntentGroupProps extends React.PropsWithChildren {
  count: number
  href: string
  foregroundColor: string
}

const IntentGroup: React.FC<Readonly<IntentGroupProps>> = ({ children, count, href, foregroundColor }) => (
  <a
    className={clsx(
      "flex flex-row gap-1 items-center cursor-pointer group/intent text-twitter-gray fill-twitter-gray leading-none text-[13px]",
      foregroundColor
    )}
    href={href}
    target="_blank"
    rel="noreferrer"
  >
    {children}
    {count > 1000 ? `${(count / 1000).toFixed(1)}K` : count.toLocaleString()}
  </a>
)

async function getTweet(id: string): Promise<ITweet> {
  const res = await fetch("https://chirp.alexandru.so/api/tweet/" + id, {
    next: { revalidate: 31536000 },
  })
  const tweet = (await res.json()) as ITweet
  return tweet
}

interface TweetProps {
  tweetId: string
}

export const Tweet = async ({ tweetId }: Readonly<TweetProps>) => {
  const tweet = await getTweet(tweetId)

  return (
    <div className={clsx("hover:scale-[1.03] mb-5 mr-5 hover:translate-x-1 hover:-translate-y-1", TRANSFORM_ANIMATION)}>
      <TiltWrapper className="[transform-style:preserve-3d]">
        <div
          className={clsx(
            "group bg-white p-8 flex flex-col gap-5 rounded-[32px] font-inter shadow-md hover:shadow-xl [transform-style:preserve-3d]",
            TRANSFORM_ANIMATION
          )}
        >
          <div className={clsx("flex gap-3 items-center", PARALLAX_STYLE, TRANSFORM_ANIMATION)}>
            {tweet.author.profileImageURI && (
              <a href={`https://twitter.com/${tweet.author.username}`} target="_blank" rel="noreferrer">
                <Image
                  src={tweet.author.profileImageURI}
                  alt={`${tweet.author.name}'s profile picture`}
                  width={48}
                  height={48}
                  className="rounded-full"
                  priority
                />
              </a>
            )}
            <div className="flex flex-col">
              <a
                href={`https://twitter.com/${tweet.author.username}`}
                target="_blank"
                rel="noreferrer"
                role="heading"
                aria-level={3}
                className="text-md font-medium leading-5 underline-offset-2 hover:underline"
              >
                {tweet.author.name}
              </a>
              <a
                href={`https://twitter.com/${tweet.author.username}`}
                target="_blank"
                rel="noreferrer"
                role="heading"
                aria-level={3}
                className="text-twitter-gray pt-0.5 leading-5"
              >
                @{tweet.author.username}
              </a>
            </div>

            <a
              className="text-twitter-brand-blue ml-auto"
              href={`https://twitter.com/${tweet?.author.username}/status/${tweet?.id}`}
              target="_blank"
              rel="noreferrer"
              aria-label="Tweet link"
            >
              <TwitterIcon />
            </a>
          </div>

          <p className={clsx("text-lg", PARALLAX_STYLE, TRANSFORM_ANIMATION)}>{tweet.text}</p>

          <MediaGroup media={tweet.media} />

          <div
            className={clsx("flex justify-between items-center w-full -m-[7px]", PARALLAX_STYLE, TRANSFORM_ANIMATION)}
          >
            <IntentGroup
              count={tweet.publicMetrics.replyCount}
              foregroundColor="hover:text-twitter-blue"
              href={`https://twitter.com/intent/tweet?in_reply_to=${tweet.id}`}
            >
              <ReplyIcon
                aria-label="replies"
                className={clsx("group-hover/intent:bg-twitter-faded-blue", ICON_STYLE)}
              />
            </IntentGroup>
            <IntentGroup
              count={tweet.publicMetrics.likeCount}
              foregroundColor="hover:text-twitter-red"
              href={`https://twitter.com/intent/like?tweet_id=${tweet.id}`}
            >
              <HeartIcon aria-label="likes" className={clsx("group-hover/intent:bg-twitter-faded-red", ICON_STYLE)} />
            </IntentGroup>
            <IntentGroup
              count={tweet.publicMetrics.retweetCount}
              foregroundColor="hover:text-twitter-green"
              href={`https://twitter.com/intent/retweet?tweet_id=${tweet.id}`}
            >
              <RetweetIcon
                aria-label="retweets"
                className={clsx("group-hover/intent:bg-twitter-faded-green", ICON_STYLE)}
              />
            </IntentGroup>
            {tweet.publicMetrics.impressionCount > 0 && (
              <IntentGroup
                count={tweet.publicMetrics.impressionCount}
                foregroundColor="hover:text-twitter-blue"
                href={`https://twitter.com/${tweet?.author.username}/status/${tweet?.id}`}
              >
                <ImpressionIcon
                  aria-label="impressions"
                  className={clsx("group-hover/intent:bg-twitter-faded-blue", ICON_STYLE)}
                />
              </IntentGroup>
            )}
          </div>
        </div>
      </TiltWrapper>
    </div>
  )
}
