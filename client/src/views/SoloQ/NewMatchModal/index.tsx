import { Button, Spin } from 'antd'

import { INewMatchModal } from './models'
import { MainWrapper } from './styles'
import { useState } from 'react'

export const NewMatchModal = ({ onAccept, onReject }: INewMatchModal) => {
  const [isAccepting, setIsAccepting] = useState(false)

  const handleAccept = () => {
    onAccept()
    setIsAccepting(true)
  }

  return (
    <MainWrapper className="match-found-modal">
      <div className="modal-opacity" />
      <div className="main-content">
        {isAccepting ? (
          <Spin size="large" />
        ) : (
          <div>
            <h2> New Match Found! </h2>
            <div className="buttons-section">
              <Button type="primary" onClick={handleAccept}>
                Accept
              </Button>

              <Button danger onClick={onReject}>
                Reject
              </Button>
            </div>
          </div>
        )}
      </div>
    </MainWrapper>
  )
}
