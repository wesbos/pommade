#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri::{
    CustomMenuItem, Manager, PhysicalPosition, Position, SystemTray, SystemTrayEvent,
    SystemTrayMenu, SystemTrayMenuItem, WindowEvent,
};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() {
    let tray_menu = SystemTrayMenu::new();
    let system_tray = SystemTray::new().with_menu(tray_menu);

    tauri::Builder::default()
        .system_tray(system_tray)
        .on_system_tray_event(|app, event| match event {
            //
            // Handle menu item interaction
            //
            SystemTrayEvent::MenuItemClick { id, .. } => {
                match id.as_str() {
                    // Clicked on Quit button
                    "quit" => {
                        std::process::exit(0);
                    }
                    // Clicked on Clear button
                    "clear" => {
                        print!("HIDE")
                    }
                    // Clicked on Settings button
                    "settings" => {
                        print!("RESET")
                    }
                    // Clicked on Reset button
                    "reset" => {
                        print!("RESET")
                    }
                    // Clicked on Update button
                    "update" => {
                        print!("RESET")
                    }

                    // else do nothing
                    _ => {}
                }
            }

            //
            // Handle system tray interaction
            //
            SystemTrayEvent::LeftClick { position, size, .. } => {
                let window = app.get_window("main").unwrap();

                if window.is_visible().unwrap() {
                    window.hide().unwrap();
                } else {
                    let icon_width = size.width as i32;
                    let window_size = window.outer_size().unwrap();
                    let window_width = window_size.width as i32;

                    let tray_icon_x = position.x as i32;

                    let window_position = PhysicalPosition {
                        x: (tray_icon_x + (icon_width / 2)) - (window_width / 2),
                        y: 0,
                    };

                    window
                        .set_position(Position::Physical(window_position))
                        .unwrap();

                    window.show().unwrap();

                    window.set_focus().unwrap();
                }
            }

            // else do nothing
            _ => {}
        })
        .on_window_event(|event| match event.event() {
            // Hide window when clicked outside
            WindowEvent::Focused(false) => {
                event.window().hide().unwrap();
            }

            // else do nothing
            _ => {}
        })
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
