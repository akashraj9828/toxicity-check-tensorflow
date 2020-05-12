import React from 'react';
import { ReactComponent as ToxicLogo } from "../img/toxic.svg";
const Toxic = () => <ToxicLogo width={20} height={20} />

export default ()=> <header className="App-header">
<h2><Toxic/> Toxicity-Check <Toxic/> </h2>
</header>