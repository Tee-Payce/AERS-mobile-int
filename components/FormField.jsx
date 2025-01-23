import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from "react";
import { FontAwesome } from '@expo/vector-icons';

const FormField = ({title, value, placeholder, handleChangeText, otherStyles, ...props}) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <View style={[styles.container, otherStyles]}>
            <Text style={styles.label}>{title}</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={value}
                    placeholder={placeholder}
                    placeholderTextColor="#fffc"
                    onChangeText={handleChangeText}
                    secureTextEntry={title === 'Password' && !showPassword}
                />
                {(title === 'Password' || title === 'Retype Password') && (
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <FontAwesome
                            name={showPassword ? 'eye' : 'eye-slash'}
                            style={styles.icon}
                            color='#323233'
                            size={18}
                        />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

export default FormField;

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        color: 'white',
        fontFamily: 'Poppins-Medium',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#d1d1d1',
        backgroundColor: '#1e1e1e',
        borderRadius: 16,
        height: 52,
        paddingHorizontal: 12,
    },
    input: {
        flex: 1,
        color: 'white',
        fontFamily: 'Poppins-SemiBold',
        fontSize: 16,
    },
    icon: {
        width: 24,
        height: 24,
    },
});
