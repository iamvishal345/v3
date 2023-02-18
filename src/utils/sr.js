import { isSSR } from '.';
import ScrollReveal from 'scrollreveal';

const sr = isSSR ? null : ScrollReveal();

export default sr;
