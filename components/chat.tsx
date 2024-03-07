"use client";

import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { Lightbulb, WrenchIcon } from "lucide-react";

import { useUIState, useActions } from "ai/rsc";
import { UserMessage } from "@/components/llm-stocks/message";

import { ChatScrollAnchor } from "@/lib/hooks/chat-scroll-anchor";
import { FooterText } from "@/components/footer";
import Textarea from "react-textarea-autosize";
import { useEnterSubmit } from "@/lib/hooks/use-enter-submit";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IconArrowElbow, IconPlus } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { ChatList } from "@/components/chat-list";
import { EmptyScreen } from "@/components/empty-screen";
import { AI } from "@/ai";
import { Input } from "./ui/input";
import { cn, sleep } from "@/lib/utils";
import { TActionRegistryMetadata } from "@/ai/shared/actions-metadata";
import { ClientSafeActionsRegistry } from "@/ai/shared/action-types";
import { usePathname } from "next/navigation";

export default function Chat({
  actions,
  type,
}: {
  actions: ClientSafeActionsRegistry;
  type: "streamable" | "rendered";
}) {
  const pathname = usePathname();
  const [messages, setMessages] = useUIState<typeof AI>();
  const {
    submitUserMessageStreamable,
    submitUserMessageSuperMode,
    submitUserMessageRendered,
  } = useActions<typeof AI>();
  const [inputValue, setInputValue] = useState("");
  const { formRef, onKeyDown } = useEnterSubmit();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [superMode, setSuperMode] = useState(false);

  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const [actionsSearch, setActionsSearch] = useState("");
  const [selectedActions, setSelectedActions] = useState<
    (keyof ClientSafeActionsRegistry)[]
  >([]);

  useEffect(() => {
    setMessages([]);
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/") {
        if (
          e.target &&
          ["INPUT", "TEXTAREA"].includes((e.target as any).nodeName)
        ) {
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        if (inputRef?.current) {
          inputRef.current.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [inputRef]);

  const filteredActions = useMemo(
    () =>
      Object.values(actions)
        .filter(
          (action) =>
            (action.metadata?.title
              .toLowerCase()
              .includes(actionsSearch.toLowerCase()) ||
              action.metadata.description
                .toLowerCase()
                .includes(actionsSearch.toLowerCase())) &&
            !selectedActions.includes(action.id)
        )
        .slice(0, 5),
    [actionsSearch, selectedActions]
  );

  const gradientMap = {
    Blue: "from-blue-500 to-blue-600",
    Green: "from-green-500 to-green-600",
    Red: "from-red-500 to-red-600",
    Orange: "from-orange-500 to-orange-600",
    Purple: "from-purple-500 to-purple-600",
    Pink: "from-pink-500 to-pink-600",
    Yellow: "from-yellow-500 to-yellow-600",
  } as const satisfies {
    [K in TActionRegistryMetadata["avatarGradient"]]: string;
  };

  const actionsMenu = (
    <div className="flex flex-col gap-1 pb-4">
      <Input
        value={actionsSearch}
        onChange={(e) => setActionsSearch(e.target.value)}
        placeholder="Search for an action..."
        ref={searchRef}
        className="mb-3"
        onKeyDown={(e) => {
          if (e.key === "ArrowUp") {
            setSelectedIndex((prev) => (prev - 1) % filteredActions.length);
          } else if (e.key === "ArrowDown") {
            setSelectedIndex(
              (prev) =>
                (prev + filteredActions.length + 1) % filteredActions.length
            );
          }

          if (e.key === "Enter") {
            const newAction = filteredActions[selectedIndex];
            setSelectedActions((prev) => [...prev, newAction.id]);
            setSelectedIndex(0);
            setActionsSearch("");
            e.preventDefault();
          }
        }}
      ></Input>
      {filteredActions.map((action, ix) => (
        <Button
          key={action.id}
          onClick={() => setSelectedActions([...selectedActions, action.id])}
          variant={"ghost"}
          className={cn(
            "py-6 px-4 flex flex-row gap-4 w-full justify-start overflow-y-hidden",
            selectedIndex === ix && "bg-muted"
          )}
        >
          <div
            className={cn(
              "rounded-full h-8 w-8 bg-gradient-to-r flex items-center justify-center text-white",
              gradientMap[action.metadata.avatarGradient]
            )}
          >
            <WrenchIcon className="h-4 w-4" />
          </div>
          {action.metadata.title}
          <span className="text-muted-foreground line-clamp-1 flex-1 text-left">
            {action.metadata.description}
          </span>
        </Button>
      ))}
    </div>
  );

  const handleAtKeyDown = async () => {
    setActionsSearch("");
    setSelectedIndex(0);
    setShowActionsMenu(true);

    await sleep(0);
    searchRef.current?.focus();
  };

  const selectedActionsDisplay = (
    <div className="text-sm flex flex-row flex-wrap gap-2 items-center justify-start">
      {selectedActions.length > 0
        ? `Talking to:`
        : `Use @ to select actions (all are on by default)`}
      {selectedActions.map((actionId) => (
        <div
          key={actionId}
          className={cn(
            "bg-muted text-muted-foreground rounded py-0.5 px-2 flex gap-2 items-center flex-row",
            "hover:bg-foreground hover:text-background transition-colors duration-200 ease-in-out cursor-pointer"
          )}
          onClick={() =>
            setSelectedActions((prev) => prev.filter((id) => id !== actionId))
          }
        >
          <div
            className={cn(
              "rounded-full h-4 w-4 bg-gradient-to-r flex items-center justify-center text-white",
              gradientMap[actions[actionId].metadata.avatarGradient]
            )}
          />
          <div className="text-sm">{actions[actionId].metadata.title}</div>
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <div className="pb-[200px] pt-4 md:pt-10">
        {messages.length ? (
          <>
            <ChatList messages={messages} />
          </>
        ) : (
          <EmptyScreen
            submitMessage={async (message) => {
              // Add user message UI
              setMessages((currentMessages) => [
                ...currentMessages,
                {
                  id: Date.now(),
                  display: <UserMessage>{message}</UserMessage>,
                },
              ]);

              const sa =
                selectedActions.length > 0 ? selectedActions : undefined;

              let responseMessage =
                type === "rendered"
                  ? await submitUserMessageRendered(message, sa)
                  : superMode
                    ? await submitUserMessageSuperMode(message, sa)
                    : await submitUserMessageStreamable(message, sa);

              setMessages((currentMessages) => [
                ...currentMessages,
                responseMessage,
              ]);
            }}
          />
        )}
        <ChatScrollAnchor trackVisibility={true} />
      </div>
      <div className="fixed inset-x-0 bottom-0 w-full bg-gradient-to-b from-muted/30 from-0% to-muted/30 to-50% duration-300 ease-in-out animate-in dark:from-background/10 dark:from-10% dark:to-background/80 peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px]">
        <div className="mx-auto sm:max-w-2xl sm:px-4">
          <div className="px-4 py-2 space-y-4 border-t shadow-lg bg-background sm:rounded-t-xl sm:border md:py-4">
            <form
              ref={formRef}
              onSubmit={async (e: any) => {
                e.preventDefault();

                // Blur focus on mobile
                if (window.innerWidth < 600) {
                  e.target["message"]?.blur();
                }

                const value = inputValue.trim();
                setInputValue("");
                if (!value) return;

                // Add user message UI
                setMessages((currentMessages) => [
                  ...currentMessages,
                  {
                    id: Date.now(),
                    display: <UserMessage>{value}</UserMessage>,
                  },
                ]);

                try {
                  const sa =
                    selectedActions.length > 0 ? selectedActions : undefined;

                  let responseMessage =
                    type === "rendered"
                      ? await submitUserMessageRendered(value, sa)
                      : superMode
                        ? await submitUserMessageSuperMode(value, sa)
                        : await submitUserMessageStreamable(value, sa);

                  setMessages((currentMessages) => [
                    ...currentMessages,
                    responseMessage,
                  ]);
                } catch (error) {
                  // You may want to show a toast or trigger an error state.
                  console.error(error);
                }
              }}
            >
              {showActionsMenu &&
                selectedActions.length < Object.keys(actions).length &&
                actionsMenu}
              <div className="flex flex-row gap-2 justify-between items-start pb-4">
                {selectedActionsDisplay}
                {type === "streamable" && (
                  // for now, only show super mode when using streamable registry
                  <div className="flex flex-row gap-2 items-center">
                    <input
                      type="checkbox"
                      checked={superMode}
                      onChange={(e) => setSuperMode(e.target.checked)}
                      id="superMode"
                    />
                    <label
                      className="text-sm whitespace-nowrap"
                      htmlFor="superMode"
                    >
                      Super Mode
                    </label>
                  </div>
                )}
              </div>
              <div className="relative flex flex-col w-full px-8 overflow-hidden max-h-60 grow bg-background sm:rounded-md sm:border sm:px-12">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute left-0 w-8 h-8 p-0 rounded-full top-4 bg-background sm:left-4"
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.reload();
                      }}
                    >
                      <IconPlus />
                      <span className="sr-only">New Chat</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>New Chat</TooltipContent>
                </Tooltip>
                <Textarea
                  ref={inputRef}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "@") {
                      handleAtKeyDown();
                      e.preventDefault();
                    }
                    onKeyDown(e);
                  }}
                  placeholder="Send a message."
                  className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
                  autoFocus
                  spellCheck={false}
                  autoComplete="off"
                  onFocus={(e) => {
                    setShowActionsMenu(false);
                  }}
                  autoCorrect="off"
                  name="message"
                  rows={1}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <div className="absolute right-0 top-4 sm:right-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="submit"
                        size="icon"
                        disabled={inputValue === ""}
                      >
                        <IconArrowElbow />
                        <span className="sr-only">Send message</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Send message</TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </form>
            <FooterText className="hidden sm:block" />
          </div>
        </div>
      </div>
    </div>
  );
}
