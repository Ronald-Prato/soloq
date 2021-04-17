import styled from 'styled-components'

export const MainWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: grid;
  place-items: center;

  div.modal-opacity {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    z-index: -1;
  }

  div.main-content {
    width: 500px;
    height: 400px;
    background: white;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    h2 {
      margin: 0;
    }

    div.buttons-section {
      margin-top: 20px;
      width: 180px;
      display: flex;
      justify-content: space-between;
    }
  }
`
