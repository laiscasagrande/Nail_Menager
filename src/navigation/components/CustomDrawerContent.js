import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { Image, StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";

export default function CustomDrawerContent(props) {

    return (
        <DrawerContentScrollView {...props} contentContainerStyle={styles.container}>
            <View>
                <Image source={require('../../../assets/logo.png')} style={styles.image}/>
                <DrawerItemList {...props} />
            </View>
        </DrawerContentScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        paddingVertical: 20,
    },
    image: {
        width: 300,
        height: 100,
        resizeMode: 'contain',
    },
    logoutButton: {
        marginLeft: 20,
        marginBottom: 20,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.18)',
        alignSelf: 'flex-start',
    },
    logoutText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});