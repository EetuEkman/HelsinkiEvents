import Language from "./Language";
import Meta from "./Meta";

export default interface Languages {
    meta?: Meta;
    data: Language[];
}