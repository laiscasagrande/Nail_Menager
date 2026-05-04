import { Text, View } from "react-native";
import { Appbar } from "react-native-paper";

export default function Header() {
    return (
        <Appbar.Header>
            <Appbar.Content title="Title" />
        </Appbar.Header>
    )
}