import { StatusBar } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Root from "@/components/Root";
import "./globals.css";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
        <StatusBar backgroundColor="white" />
        <Root />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
