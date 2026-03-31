import Root from "./card.svelte";
import Content from "./card-content.svelte";
import Description from "./card-description.svelte";
import Footer from "./card-footer.svelte";
import Header from "./card-header.svelte";
import Title from "./card-title.svelte";
import Action from "./card-action.svelte";

const Card = Root;
const CardHeader = Header;
const CardTitle = Title;
const CardContent = Content;
const CardDescription = Description;
const CardFooter = Footer;
const CardAction = Action;

export {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardDescription,
	CardFooter,
	CardAction,
};

export default Card;