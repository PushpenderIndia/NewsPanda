import React from 'react';
import { TouchableOpacity, Text, View, ActivityIndicator } from 'react-native';

export type DuoButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'outline';

interface DuoButtonProps {
  title: string;
  onPress: () => void;
  variant?: DuoButtonVariant;
  disabled?: boolean;
  isLoading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const DuoButton: React.FC<DuoButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  isLoading = false,
  icon,
  fullWidth = false,
  size = 'large',
}) => {
  const getVariantStyles = () => {
    const isDisabled = disabled || isLoading;

    switch (variant) {
      case 'primary':
        return {
          backgroundColor: isDisabled ? '#E5E5E5' : '#58CC02',
          borderBottomColor: isDisabled ? '#ADADAD' : '#46A302',
          borderBottomWidth: isDisabled ? 2 : 4,
          textColor: isDisabled ? '#ADADAD' : '#FFFFFF',
        };
      case 'secondary':
        return {
          backgroundColor: isDisabled ? '#E5E5E5' : '#1CB0F6',
          borderBottomColor: isDisabled ? '#ADADAD' : '#1899D6',
          borderBottomWidth: isDisabled ? 2 : 4,
          textColor: isDisabled ? '#ADADAD' : '#FFFFFF',
        };
      case 'success':
        return {
          backgroundColor: isDisabled ? '#E5E5E5' : '#58CC02',
          borderBottomColor: isDisabled ? '#ADADAD' : '#46A302',
          borderBottomWidth: isDisabled ? 2 : 4,
          textColor: isDisabled ? '#ADADAD' : '#FFFFFF',
        };
      case 'danger':
        return {
          backgroundColor: isDisabled ? '#E5E5E5' : '#FF4B4B',
          borderBottomColor: isDisabled ? '#ADADAD' : '#D63939',
          borderBottomWidth: isDisabled ? 2 : 4,
          textColor: isDisabled ? '#ADADAD' : '#FFFFFF',
        };
      case 'outline':
        return {
          backgroundColor: '#FFFFFF',
          borderBottomColor: '#E5E5E5',
          borderBottomWidth: 2,
          borderWidth: 2,
          borderColor: '#E5E5E5',
          textColor: '#3C3C3C',
        };
      default:
        return {
          backgroundColor: '#58CC02',
          borderBottomColor: '#46A302',
          borderBottomWidth: 4,
          textColor: '#FFFFFF',
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: 8,
          paddingHorizontal: 16,
          fontSize: 14,
          borderRadius: 12,
        };
      case 'medium':
        return {
          paddingVertical: 12,
          paddingHorizontal: 20,
          fontSize: 16,
          borderRadius: 14,
        };
      case 'large':
        return {
          paddingVertical: 16,
          paddingHorizontal: 24,
          fontSize: 18,
          borderRadius: 16,
        };
      default:
        return {
          paddingVertical: 16,
          paddingHorizontal: 24,
          fontSize: 18,
          borderRadius: 16,
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
      style={[
        {
          backgroundColor: variantStyles.backgroundColor,
          borderBottomWidth: variantStyles.borderBottomWidth,
          borderBottomColor: variantStyles.borderBottomColor,
          borderTopWidth: variantStyles.borderWidth || 0,
          borderLeftWidth: variantStyles.borderWidth || 0,
          borderRightWidth: variantStyles.borderWidth || 0,
          borderTopColor: variantStyles.borderColor,
          borderLeftColor: variantStyles.borderColor,
          borderRightColor: variantStyles.borderColor,
          borderRadius: sizeStyles.borderRadius,
          paddingVertical: sizeStyles.paddingVertical,
          paddingHorizontal: sizeStyles.paddingHorizontal,
          width: fullWidth ? '100%' : undefined,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        },
      ]}
    >
      {isLoading ? (
        <ActivityIndicator color={variantStyles.textColor} />
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          {icon && <View style={{ marginRight: 8 }}>{icon}</View>}
          <Text
            style={{
              color: variantStyles.textColor,
              fontSize: sizeStyles.fontSize,
              fontWeight: 'bold',
              textAlign: 'center',
            }}
          >
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default DuoButton;
