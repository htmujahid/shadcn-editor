import { Route, Switch } from "wouter"

import { CollaborationPage } from "@/pages/collaboration"
import { CollaborationEditorPage } from "@/pages/collaboration-editor"
import { ExamplesPage } from "@/pages/examples"
import { HomePage } from "@/pages/home"
import { NotFoundPage } from "@/pages/not-found"

export function App() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/examples" component={ExamplesPage} />
      <Route path="/collaboration" component={CollaborationPage} />
      <Route path="/collaboration/editor" component={CollaborationEditorPage} />
      <Route component={NotFoundPage} />
    </Switch>
  )
}
