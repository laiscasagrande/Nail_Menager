import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { Image, StyleSheet } from "react-native";

export default function CustomDrawerContent(props) {
    return (
        <DrawerContentScrollView {...props}>
            <Image source={require('../../../assets/logo.png')} style={styles.image}/>
            <DrawerItemList {...props} />
        </DrawerContentScrollView>
    );
}

const styles = StyleSheet.create({
    image: {
        width: 300,
        height: 100,
        resizeMode: 'contain',
    }
})