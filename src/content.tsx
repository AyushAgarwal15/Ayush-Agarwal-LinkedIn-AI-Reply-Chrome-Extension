import cssText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useRef, useState } from "react"

// components import
import Button from "~components/button"
import MessageBox from "~components/MessageBox"

// icons import
import AIPencilIcon from "../assets/ai_icon.png"
import GenerateIcon from "../assets/generate_icon.png"
import RegenerateIcon from "../assets/regenerate_icon.png"
import InsertIcon from "../assets/Vector.png"

// Configuration for Plasmo extension
export const config: PlasmoCSConfig = {
  matches: ["https://*.linkedin.com/*"] // Matches LinkedIn URLs
}

// Function to get styles
export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

// React component for the Plasmo overlay
const PlasmoOverlay = () => {
  const [showModal, setShowModal] = useState<boolean>(false) // State for modal visibility
  const [inputValue, setInputValue] = useState<string>("") // State for input value
  const [inputValueToDisplay, setInputValueToDisplay] = useState<string>("") // State for displayed input value
  const [generatedText, setGeneratedText] = useState<string>("") // State for generated text
  const [currentChatBox, setCurrentChatBox] = useState<HTMLElement | null>(null) // State for current chat box element

  const modalRef = useRef<HTMLDivElement>(null) // Ref to modal div for handling clicks

  useEffect(() => {
    // Function to handle focus event on chat box
    const handleFocus = (chatBox: HTMLElement) => {
      const iconContainer = chatBox.querySelector(".plasmo-icon") as HTMLElement
      if (iconContainer) {
        iconContainer.style.display = "block" // Show icon container when focused
        setCurrentChatBox(chatBox) // Update current chat box in state
      }
    }

    // Function to handle blur event on chat box
    const handleBlur = (chatBox: HTMLElement) => {
      const iconContainer = chatBox.querySelector(".plasmo-icon") as HTMLElement
      if (iconContainer) {
        iconContainer.style.display = "none" // Hide icon container when blurred
      }
    }

    // Function to attach icon to all chat boxes on the page
    const attachIconToChatBoxes = () => {
      const chatBoxes = document.querySelectorAll(
        ".msg-form__contenteditable.t-14.t-black--light.t-normal.flex-grow-1.full-height.notranslate"
      ) as NodeListOf<HTMLElement>

      chatBoxes.forEach((chatBox) => {
        if (!chatBox.querySelector(".plasmo-icon")) {
          // Create icon container if not already present
          const iconContainer = document.createElement("div")
          iconContainer.className =
            "plasmo-icon h-12 w-12 cursor-pointer z-50 flex"
          iconContainer.style.position = "absolute"
          iconContainer.style.bottom = "0px"
          iconContainer.style.right = "4px"

          // Create icon element
          const iconElement = document.createElement("img")
          iconElement.src = AIPencilIcon
          iconElement.alt = "icon"
          iconElement.className = "h-12 w-12 cursor-pointer"
          iconElement.onclick = () => setShowModal(true) // Show modal on icon click

          iconContainer.appendChild(iconElement) // Append icon to container
          chatBox.appendChild(iconContainer) // Append container to chat box

          // Add event listeners for focus and blur events
          chatBox.addEventListener("focus", () => handleFocus(chatBox))
          chatBox.addEventListener("blur", () => handleBlur(chatBox))

          // Initially hide icon container if chat box is not active
          if (document.activeElement !== chatBox) {
            iconContainer.style.display = "none"
          }
        }
      })
    }

    attachIconToChatBoxes() // Attach icons to chat boxes on component mount

    // Observer to watch for changes in DOM (e.g., new chat boxes added)
    const observer = new MutationObserver(() => {
      attachIconToChatBoxes() // Reattach icons on DOM changes
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true
    })

    // Cleanup function for observer
    return () => {
      observer.disconnect() // Disconnect observer on component unmount
    }
  }, []) // Empty dependency array ensures useEffect runs only once on mount

  // Function to handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value) // Update input value state
    setInputValueToDisplay(e.target.value) // Update displayed input value state
  }

  // Function to generate text
  const handleGenerate = () => {
    if (inputValue !== "") {
      // Generate text and update state
      setGeneratedText(
        "Thank you for the opportunity! If you have any more questions or if there's anything else I can help you with, feel free to ask."
      )
      setInputValue("") // Clear input value
    }
  }

  // Function to insert generated text into current chat box
  const handleInsert = () => {
    if (currentChatBox) {
      const chatBoxPlaceholder = currentChatBox.parentElement?.querySelector(
        ".msg-form__placeholder.t-14.t-black--light.t-normal"
      ) as HTMLElement

      // Hide placeholder if found
      if (chatBoxPlaceholder) {
        chatBoxPlaceholder.style.display = "none"
      }

      // Clear existing content and set generated text
      currentChatBox.innerText = generatedText.trim() // Ensure to trim text

      // Check if text was successfully inserted
      if (currentChatBox.innerText.trim() === generatedText.trim()) {
        setShowModal(false) // Hide modal
        setGeneratedText("") // Clear generated text state
        setInputValue("") // Clear input value state
      } else {
        console.error("Failed to insert text into chat box.") // Log error if text insertion fails
      }
    }
  }

  // Function to handle modal close
  const handleCloseModal = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (e.target === modalRef.current) {
      setShowModal(false) // Hide modal if clicked outside content
      setGeneratedText("") // Clear generated text state
      setInputValue("") // Clear input value state
      setInputValueToDisplay("") // Clear displayed input value state
    }
  }

  return (
    <>
      {showModal && (
        // Modal overlay
        <div
          ref={modalRef}
          className="fixed inset-0 flex items-center justify-center z-50 bg-plasmo-black bg-opacity-50"
          onClick={handleCloseModal} // Close modal on overlay click
        >
          <div
            className="bg-plasmo-white p-6 rounded-xl shadow-lg w-[40%] font-inter"
            onClick={(e) => e.stopPropagation()} // Prevent modal close on inner click
          >
            {/* Generated text display */}
            {generatedText && (
              <div className="flex flex-col gap-4 mb-4">
                <MessageBox
                  background="bg-plasmo-gray-light"
                  text={inputValueToDisplay}
                  align="right"
                />
                <MessageBox
                  background="bg-plasmo-blue-light"
                  text={generatedText}
                />
              </div>
            )}

            {/* Input field for user prompt */}
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              className="p-2 w-full mb-4 rounded-lg font-medium border border-plasmo-border-gray outline-none text-2xl text-plasmo-cadet-gray"
              placeholder="Your Prompt"
            />

            {/* Buttons for generate and insert actions */}
            <div className="flex justify-end gap-2">
              {!generatedText ? (
                <Button
                  onClick={handleGenerate}
                  className="bg-plasmo-blue-dark text-plasmo-white"
                  icon={GenerateIcon}
                  buttonText="Generate"
                />
              ) : (
                <>
                  <Button
                    onClick={handleInsert}
                    className="text-plasmo-gray-dark border-plasmo-gray-dark border-2"
                    icon={InsertIcon}
                    buttonText="Insert"
                  />
                  <Button
                    className="bg-plasmo-blue-dark text-plasmo-white"
                    disabled
                    icon={RegenerateIcon}
                    buttonText="Regenerate"
                  />
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default PlasmoOverlay
