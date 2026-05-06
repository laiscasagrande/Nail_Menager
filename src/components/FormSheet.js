import React, { forwardRef, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { COLORS } from '../constants/colors';

const FormSheet = forwardRef(({ children }, ref) => {
  const snapPoints = useMemo(() => ['7%', '80%'], []);

  return (
    <BottomSheet
      ref={ref}
      index={0} 
      snapPoints={snapPoints}
      enablePanDownToClose
      enablePanDownToClose={false}
      handleIndicatorStyle={{ backgroundColor: COLORS.primary, width: 70 }}
    >
      <BottomSheetScrollView style={styles.contentContainer}>
        {children}
      </BottomSheetScrollView>
    </BottomSheet>
  );
});

export default FormSheet;

const styles = StyleSheet.create({
  contentContainer: {
    padding: 20,
  },
});