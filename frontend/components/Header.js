import Link from "next/link";
import Nav from "./Nav";
import styled from "styled-components";
import Cart from "./Cart";
import Search from "./Search";

const HeaderStyles = styled.header`
  .bar {
    border-bottom: 10px solid var(--black, black);
    display: grid;
    grid-template-columns: auto 1fr;
    justify-content: space-between;
    align-items: stretch;
  }

  .sub-bar {
    border-bottom: 1px solid var(--black, black);
    display: grid;
    grid-template-columns: 1fr auto;
  }
`;

const Logo = styled.h1`
  background-color: red;
  font-size: 4rem;
  margin-left: 2rem;
  position: relative;
  z-index: 2;
  color: #fff;
  transform: skew(-7deg);
  a {
    color: white;
    text-decoration: none;
    text-transform: uppercase;
    padding: 0.5rem 1rem;
    font-family: "Radnika Next";
  }
`;

export default function Header() {
  return (
    <HeaderStyles>
      <div className='bar'>
        <Logo>
          <Link href='/'>Sick Fits</Link>
        </Logo>
        <Nav />
      </div>
      <div className='sub-bar'>
        <Search />
        <Cart />
      </div>
    </HeaderStyles>
  );
}
