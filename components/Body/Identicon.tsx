import { useEffect, useRef } from "react";
import { useAccount } from "wagmi";
import styled from "@emotion/styled";
// @ts-ignore Types doesn't exist in this jazzicon package
import Jazzicon from "@metamask/jazzicon";

const StyledIdenticon = styled.div`
  height: 1rem;
  width: 1rem;
  border-radius: 1.125rem;
  background-color: black;
`;

const Identicon = () => {
  const ref = useRef<HTMLDivElement>();
  const { data: account } = useAccount();

  useEffect(() => {
    if (account?.address && ref.current) {
      ref.current.innerHTML = "";
      ref.current.appendChild(
        Jazzicon(16, parseInt(account.address.slice(2, 10), 16))
      );
    }
  }, [account]);

  return <StyledIdenticon ref={ref as any} />;
};

export default Identicon;
