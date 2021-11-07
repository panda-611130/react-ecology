import "./App.less";
import BrowserRouter, {
  Link,
  Route,
  Switch,
} from "./my_node_moudles/react-router";

import HomePage from "./components/home/index";
import Login from "./components/login/index";
import reduxPage from "./components/reduxpage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div className="router-link">
          <Link className="link-item" to="/home">
            homePage
          </Link>
          <Link className="link-item" to="/user">
            userPage
          </Link>
          <Link className="link-item" to="/login">
            loginPage
          </Link>
          <Link className="link-item redux" to="/reduxPage">
            reduxPage
          </Link>
          <Link className="link-item" to="/errordebug">
            404 debug
          </Link>
        </div>

        <div className="router-view">
          {/* <Switch location={{ pathname: "/reduxPage" }}> */}
          <Switch>
            <Route exact path="/home" component={HomePage} />
            <Route exact path="/login" children={Login} />
            {/* 如果外层不包裹 switch 会发现 下面的这个路由总是渲染的 */}
            <Route exact path="/reduxPage" component={reduxPage} />
            <Route
              path="/user"
              render={() => (
                <div className="user-page">user page 使用Route-render Api</div>
              )}
            />
            {/* 注意  404 的页面目前我们只制定了 children 的api方式 其他component-render 都是无效的  */}
            <Route children={() => {
              return (<div className="mother-fuker "
                style={{ width: "100%", height: "100%", textAlign: "center", color: "red" }}>
                <pre>
                  surprise mother fuker!!!
                  page not find 0_0
                </pre>
              </div>)
            }} />
          </Switch>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
