<template>
  <!--   <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </nav> -->
  <!-- 
    <div class="AvaNavContainer" >
    <NavContainer id="NavContainer"
        title="导航"
    >
      <NavBar></NavBar>
      <MiniInfo></MiniInfo>
    </NavContainer>
  
    <SliderButton></SliderButton>
    </div>
      -->
  <router-view />
</template>
  
  <script>
  
  
  
  export default{
    components:{
    },
  
  }
  </script>
  
  <style>
  
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
  
  nav {
    padding: 30px;
  }
  
  nav a {
    font-weight: bold;
    color: #2c3e50;
  }
  
  nav a.router-link-exact-active {
    color: #42b983;
  }
  
  
  /* ################################ */
  
  /* .AvaNavContainer{
    position: absolute;
    border: 1px solid red;
    height: 100%;
    top: 50%;
    transform: translateY(-50%);
    width: 220px;
  }
  
  .AvaNavContainer:hover{
    height: 100%;
  } */
  
  
  </style>
  