import { BrowserRouter, Route, Switch } from 'react-router-dom'

import { Register } from './views/Register'
import { Room } from './views/Room'
import { SoloQ } from './views/SoloQ'

export const Router = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Register} />
        <Route exact path="/soloq" component={SoloQ} />
        <Route exact path="/room" component={Room} />
      </Switch>
    </BrowserRouter>
  )
}
