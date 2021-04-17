import styled from 'styled-components'

export const MainWrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;

  h2.active-users-amount {
    position: absolute;
    top: 20px;
    left: 20px;
  }

  div.avatar-section {
    background: #323232;
    border-radius: 5px;
    width: 200px;
    height: 320px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5),
      inset 0 1px 5px 1px rgba(255, 255, 255, 0.4);
    padding: 20px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
  }

  p.avatar-name {
    font-size: 20px;
    font-weight: bolder;
    margin: 0;
    color: white;
  }

  div.ranking {
    margin-top: 50px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    img.ranking-icon {
      width: 45px;
    }

    p.ranking-number {
      margin-top: 10px;
      color: white;
      font-size: 20px;
    }
  }

  section.in-queue-section {
    display: grid;
    place-items: center;
  }
`
